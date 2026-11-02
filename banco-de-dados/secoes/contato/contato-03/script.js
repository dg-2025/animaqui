// Sem JS ou com movimento reduzido, os cartões já aparecem parados.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

raiz.classList.add('animar');
new IntersectionObserver(function (itens, observador) {
  if (!itens[0].isIntersecting) return;
  raiz.classList.add('visivel');
  observador.disconnect();
}, { threshold: 0.1 }).observe(raiz);
