import { verifyChargeToken } from '../lib/charge-token.mjs';
import { json } from '../lib/http.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, { success: false, error: 'Metodo nao permitido' }, 405);
  }

  const reference = String(req.query?.reference || '');
  const nonce = String(req.query?.nonce || '');
  const token = String(req.query?.token || '');

  const payload = verifyChargeToken(token);
  if (!payload || payload.id !== reference || payload.statusNonce !== nonce) {
    return json(res, { success: false, error: 'Cobranca nao encontrada' }, 404);
  }

  const paid = Math.floor(Date.now() / 1000) >= Number(payload.paidAfter);

  return json(res, {
    success: true,
    data: {
      paid,
      thankYouUrl: 'checkout.html?paid=1',
    },
  });
}
