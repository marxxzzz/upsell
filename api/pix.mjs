import { config } from '../lib/config.mjs';
import { isValidCpf, sanitizeName, normalizeCpf } from '../lib/cpf.mjs';
import { createChargeToken, generateDemoBrCode } from '../lib/charge-token.mjs';
import { json, readJson } from '../lib/http.mjs';

async function qrDataUri(payload) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payload)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return '';
    const buf = Buffer.from(await response.arrayBuffer());
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return '';
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, { success: false, error: 'Metodo nao permitido' }, 405);
  }

  const body = await readJson(req);
  const name = sanitizeName(body.name);
  const document = normalizeCpf(body.document);
  const email = String(body.email || '').trim();
  const telephone = String(body.telephone || '').replace(/\D/g, '');

  if (!isValidCpf(document) || name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || telephone.length < 10) {
    return json(res, { success: false, error: 'Payload invalido' }, 422);
  }

  const chargeId = `chg_${Math.random().toString(36).slice(2, 10)}`;
  const statusNonce = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const paidAfter = Math.floor(Date.now() / 1000) + config.demoPixPaidAfterSeconds;
  const brCode = generateDemoBrCode(config.amount, chargeId);
  const statusToken = createChargeToken({ id: chargeId, statusNonce, paidAfter });
  const dataUri = await qrDataUri(brCode);

  return json(res, {
    success: true,
    data: {
      id: chargeId,
      status_nonce: statusNonce,
      status_token: statusToken,
      brCode,
      pix: { qr_code: { data_uri: dataUri } },
    },
  });
}
