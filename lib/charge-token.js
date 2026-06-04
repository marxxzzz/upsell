import crypto from 'crypto';
import { config } from './config.js';

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', config.chargeSecret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function createChargeToken({ id, statusNonce, paidAfter }) {
  return sign({ id, statusNonce, paidAfter });
}

export function verifyChargeToken(token) {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', config.chargeSecret).update(body).digest('base64url');
  if (sig !== expected) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export function generateDemoBrCode(amount, chargeId) {
  const value = amount.toFixed(2);
  return `00020126580014BR.GOV.BCB.PIX0136demo-${chargeId}520400005303986540${value.length}${value}5802BR5925TAXA ENTREGA CORREIOS6009CURITIBA62070503***6304DEMO`;
}
