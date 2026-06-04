import { config } from '../lib/config.js';
import { isValidCpf, sanitizeName, normalizeCpf } from '../lib/cpf.js';
import { json, readJson } from '../lib/http.js';

/** Valida payload; persistência fica no sessionStorage do cliente (serverless). */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, { success: false, error: 'Metodo nao permitido' }, 405);
  }

  const body = await readJson(req);
  if (body.nonce !== config.customerFlowNonce) {
    return json(res, { success: false, error: 'Nonce invalido' }, 403);
  }

  const cpf = normalizeCpf(body.cpf);
  const nome = sanitizeName(body.nome);

  if (!isValidCpf(cpf) || nome.length < 3) {
    return json(res, { success: false, error: 'Payload invalido' }, 422);
  }

  return json(res, { success: true });
}
