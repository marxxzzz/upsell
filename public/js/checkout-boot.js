(function () {
  window.Funnel.captureTracking(window.location.search);
  const customer = window.Funnel.getCustomer();
  let tracking = {};
  try {
    tracking = JSON.parse(localStorage.getItem('funnel_tracking') || '{}');
  } catch (_) {}

  const cfg = window.AppConfig || {};
  window.CHECKOUT_CONFIG = {
    initialCustomerName: customer.nome || customer.name || '',
    initialCustomerDocument: customer.cpf || '',
    customerEmail: customer.email || '',
    customerTelephone: customer.telefone || '',
    trackingData: tracking,
    productKey: cfg.productKey || 'main',
    cpfLookupNonce: cfg.checkoutCpfNonce || '',
    amount: cfg.amount || 58.36,
    clientScope: window.location.origin,
  };
})();
