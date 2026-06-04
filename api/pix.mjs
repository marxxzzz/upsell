import { config } from '../lib/config.mjs';
import { isValidCpf, sanitizeName, normalizeCpf } from '../lib/cpf.mjs';
import {
  amountToCents,
  createPixTransaction,
  formatPhoneBr,
  qrCodeDataUri,
  sanitizeExternalId,
} from '../lib/buckpay.mjs';
import { json, readJson } from '../lib/http.mjs';

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

  const amountCents = amountToCents(config.amount);
  if (amountCents < 600 || amountCents > 300000) {
    return json(res, { success: false, error: 'Valor invalido para a Buckpay' }, 422);
  }

  const externalId = sanitizeExternalId(body.idempotency_key || `upsell-${document}`);
  const phone = formatPhoneBr(telephone);

  const tracking = body.tracking && typeof body.tracking === 'object' ? body.tracking : {};
  const buckpayPayload = {
    external_id: externalId,
    payment_method: 'pix',
    amount: amountCents,
    buyer: {
      name,
      email,
      document,
      ...(phone ? { phone } : {}),
    },
    product: {
      id: String(body.product_key || config.productKey),
      name: 'Taxa de Entrega',
    },
    offer: {
      id: `${body.product_key || config.productKey}-offer`,
      name: 'Taxa de Entrega',
      quantity: 1,
    },
    tracking: {
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

    return json(res, {
      success: true,
      data: {
        id: data.id,
        external_id: externalId,
        status_nonce: data.id,
        brCode: pix.code || '',
        pix: {
          qr_code: {
            data_uri: qrCodeDataUri(pix.qrcode_base64 || ''),
          },
        },
      },
    });
  } catch (error) {
    const status = error.status && error.status < 500 ? error.status : 502;
    return json(res, {
      success: false,
      error: error.message || 'Erro ao gerar PIX na Buckpay',
      details: error.body || null,
    }, status);
  }
}
