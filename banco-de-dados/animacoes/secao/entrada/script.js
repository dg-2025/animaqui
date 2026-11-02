if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

raiz.classList.add('animaEntrada');
raiz.querySelectorAll('[data-anima]').forEach(function (elemento, indice) {
  elemento.style.setProperty('--i', indice);
});
new IntersectionObserver(function (itens, observador) {
  if (!itens[0].isIntersecting) return;
  raiz.classList.add('visivel');
  observador.disconnect();
}, { threshold: 0.15 }).observe(raiz);
