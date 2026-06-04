export function normalizeCpf(cpf) {
  return String(cpf || '').replace(/\D/g, '').slice(0, 11);
}

export function isValidCpf(cpf) {
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

export function sanitizeName(name) {
  return String(name || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
}

export function lookupCpfName(cpf, database) {
  return database[normalizeCpf(cpf)] || null;
}
