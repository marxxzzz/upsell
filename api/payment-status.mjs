import { getTransactionById, mapBuckpayStatus } from '../lib/buckpay.mjs';
import { json } from '../lib/http.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, { success: false, error: 'Metodo nao permitido' }, 405);
  }

  const reference = String(req.query?.reference || '').trim();
  if (!reference) {
    return json(res, { success: false, error: 'Referencia invalida' }, 422);
  }

  try {
    const result = await getTransactionById(reference);
    const data = result.data || result;
    const paid = mapBuckpayStatus(data.status) === 'paid';

    return json(res, {
      success: true,
      data: {
        paid,
        status: data.status || 'pending',
        thankYouUrl: 'checkout.html?paid=1',
      },
    });
  } catch (error) {
    const status = error.status === 404 ? 404 : error.status && error.status < 500 ? error.status : 502;
    return json(res, {
      success: false,
      error: error.message || 'Nao foi possivel consultar o pagamento',
    }, status);
  }
}
