(function () {
  window.Funnel.captureTracking(window.location.search);

  const cfg = window.AppConfig || {};
  const params = new URLSearchParams(window.location.search);
  const customer = window.Funnel.getCustomer();

  const cpf = (params.get('cpf') || customer.cpf || '').replace(/\D/g, '');
  const nome = (params.get('nome') || customer.nome || customer.name || 'Cliente').trim();

  if (cpf && nome) {
    window.Funnel.saveCustomer({ cpf, nome });
  }

  const cpfFormatado = cpf ? window.Funnel.formatCpf(cpf) : '000.000.000-00';
  const nomeExibicao = nome || 'Cliente';
  const primeiroNome = nomeExibicao.split(' ')[0];
  const hoje = new Date();
  const prazoRegularizacao = hoje.toLocaleDateString('pt-BR');
  const entrega = new Date(hoje);
  entrega.setDate(entrega.getDate() + 6);
  const prazoEntrega = entrega.toLocaleDateString('pt-BR');
  const checkoutUrl = window.Funnel.buildUrl('checkout.html');

  document.querySelectorAll('[data-fill="nome"]').forEach((el) => {
    el.textContent = nomeExibicao;
  });
  document.querySelectorAll('[data-fill="cpf"]').forEach((el) => {
    el.textContent = cpfFormatado;
  });
  document.querySelectorAll('[data-fill="primeiro-nome"]').forEach((el) => {
    el.textContent = primeiroNome;
  });
  document.querySelectorAll('[data-fill="cidade"]').forEach((el) => {
    el.textContent = cfg.city || 'Curitiba';
  });
  document.querySelectorAll('[data-fill="estado"]').forEach((el) => {
    el.textContent = cfg.state || 'PR';
  });
  document.querySelectorAll('[data-fill="prazo-reg"]').forEach((el) => {
    el.textContent = prazoRegularizacao;
  });
  document.querySelectorAll('[data-fill="prazo-entrega"]').forEach((el) => {
    el.textContent = prazoEntrega;
  });
  document.querySelectorAll('[data-checkout-link]').forEach((el) => {
    el.setAttribute('href', checkoutUrl);
  });

  const trackingQuery = window.Funnel.getTrackingQuery();
  if (trackingQuery) {
    const link = `checkout.html?${trackingQuery}`;
    function setBackRedirect(url) {
      const urlBackRedirect = `${url.trim()}${url.indexOf('?') > 0 ? '&' : '?'}${trackingQuery}`;
      history.pushState({}, '', location.href);
      history.pushState({}, '', location.href);
      history.pushState({}, '', location.href);
      window.addEventListener('popstate', () => {
        setTimeout(() => {
          location.href = urlBackRedirect;
        }, 1);
      });
    }
    setBackRedirect(link);
  }
})();
