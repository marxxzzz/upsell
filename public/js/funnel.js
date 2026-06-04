window.Funnel = (function () {
  const TRACKING_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'campaign', 'fbclid', 'gclid', 'click_id'];
  const CUSTOMER_KEY = 'checkout_customer';
  const TRACKING_KEY = 'funnel_tracking';

  function captureTracking(source) {
    const params = source instanceof URLSearchParams ? source : new URLSearchParams(source || window.location.search);
    const tracking = {};
    TRACKING_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) tracking[key] = value;
    });
    if (Object.keys(tracking).length) {
      try {
        const saved = JSON.parse(localStorage.getItem(TRACKING_KEY) || '{}');
        localStorage.setItem(TRACKING_KEY, JSON.stringify({ ...saved, ...tracking }));
      } catch (_) {}
    }
    return tracking;
  }

  function getTrackingQuery() {
    try {
      const saved = JSON.parse(localStorage.getItem(TRACKING_KEY) || '{}');
      return new URLSearchParams(saved).toString();
    } catch {
      return '';
    }
  }

  function saveCustomer(customer) {
    const payload = {
      cpf: String(customer.cpf || '').replace(/\D/g, ''),
      nome: String(customer.nome || customer.name || '').trim(),
      name: String(customer.nome || customer.name || '').trim(),
      email: String(customer.email || '').trim(),
      telefone: String(customer.telefone || customer.telephone || '').replace(/\D/g, ''),
    };
    try {
      sessionStorage.setItem(CUSTOMER_KEY, JSON.stringify(payload));
    } catch (_) {}
    return payload;
  }

  function getCustomer() {
    try {
      return JSON.parse(sessionStorage.getItem(CUSTOMER_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function formatCpf(cpf) {
    const digits = String(cpf || '').replace(/\D/g, '').slice(0, 11);
    if (digits.length !== 11) return cpf || '';
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  function buildUrl(base, params = {}) {
    const urlParams = new URLSearchParams(getTrackingQuery());
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    const query = urlParams.toString();
    return query ? `${base}?${query}` : base;
  }

  async function saveCustomerRemote(customer) {
    saveCustomer(customer);
    try {
      const response = await fetch('/save_customer.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nonce: window.AppConfig.customerFlowNonce,
          cpf: customer.cpf,
          nome: customer.nome || customer.name,
          email: customer.email || '',
          telefone: customer.telefone || customer.telephone || '',
        }),
      });
      const data = await response.json();
      return data && data.success;
    } catch {
      return true;
    }
  }

  return {
    captureTracking,
    getTrackingQuery,
    saveCustomer,
    getCustomer,
    formatCpf,
    buildUrl,
    saveCustomerRemote,
  };
})();
