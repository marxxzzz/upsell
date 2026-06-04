const BASE_URL = process.env.BUCKPAY_API_URL || 'https://api.realtechdev.com.br';
const TIMEOUT_MS = 28_000;

export function getBuckpayHeaders() {
  const token = process.env.BUCKPAY_TOKEN || '';
  const userAgent = process.env.BUCKPAY_USER_AGENT || 'Buckpay API';

  if (!token) {
    throw new Error('BUCKPAY_TOKEN nao configurado');
  }

  return {
    Authorization: `Bearer ${token}`,
    'User-Agent': userAgent,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

function buildBuckpayError(res, body = null) {
  const detail = body?.error?.detail;
  let message = body?.error?.message || body?.message || res.statusText;

  if (typeof detail === 'string') {
    message = detail;
  } else if (Array.isArray(detail)) {
    message = detail.join('; ');
  } else if (detail && typeof detail === 'object') {
    message = Object.entries(detail)
      .flatMap(([, value]) => (Array.isArray(value) ? value : [String(value)]))
      .filter(Boolean)
      .join('; ') || message;
  }

  const error = new Error(message || `BuckPay HTTP ${res.status}`);
  error.status = res.status;
  error.body = body;
  return error;
}

async function parseBuckpayError(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return buildBuckpayError(res, body);
}

export function formatPhoneBr(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return undefined;
  if (!digits.startsWith('55')) digits = `55${digits}`;
  if (digits.length >= 12 && digits.length <= 13) return digits;
  return undefined;
}

export function sanitizeExternalId(raw) {
  const base = String(raw || '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 200);
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return `${base}-${suffix}`.slice(0, 255);
}

export function amountToCents(amount) {
  return Math.round(Number(amount) * 100);
}

export function qrCodeDataUri(base64) {
  if (!base64) return '';
  if (base64.startsWith('data:')) return base64;
  return `data:image/png;base64,${base64}`;
}

export function mapBuckpayStatus(status) {
  if (status === 'paid') return 'paid';
  if (status === 'pending') return 'pending';
  if (status === 'cancelled' || status === 'canceled') return 'cancelled';
  if (status === 'failed' || status === 'refused' || status === 'expired') return 'failed';
  return 'pending';
}

export async function createPixTransaction(payload) {
  const res = await fetch(`${BASE_URL}/v1/transactions`, {
    method: 'POST',
    headers: getBuckpayHeaders(),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw buildBuckpayError(res, json);
  }
  return json;
}

export async function getTransactionById(id) {
  const safeId = String(id || '').trim();
  if (!safeId || !/^[a-zA-Z0-9-]+$/.test(safeId)) {
    throw new Error('ID da transacao invalido');
  }

  const res = await fetch(`${BASE_URL}/v1/transactions/${encodeURIComponent(safeId)}`, {
    method: 'GET',
    headers: getBuckpayHeaders(),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw await parseBuckpayError(res);
  }
  return res.json();
}
