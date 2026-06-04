import { config } from '../lib/config.js';
import { isValidCpf, lookupCpfName, normalizeCpf } from '../lib/cpf.js';
import { json } from '../lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, { found: false, error: 'Metodo nao permitido' }, 405);
  }

  const cpf = normalizeCpf(req.query?.cpf);
  const nonce = String(req.query?.nonce || '');

  if (![config.cpfLookupNonce, config.checkoutCpfNonce].includes(nonce)) {
    return json(res, { found: false, error: 'Nonce invalido' }, 403);
  }

  if (!isValidCpf(cpf)) {
    return json(res, { found: false, error: 'CPF invalido' });
  }

  const name = lookupCpfName(cpf, config.cpfDatabase);
  if (name) {
    return json(res, { found: true, data: { NOME: name } });
  }

  return json(res, { found: false, error: 'Nao foi possivel consultar este CPF agora' });
}
