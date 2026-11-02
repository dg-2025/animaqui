if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

raiz.querySelectorAll('[data-anima]').forEach(function (elemento, indice) {
  elemento.style.setProperty('--i', indice);
});
raiz.classList.add('animaZoom');

new IntersectionObserver(function (itens, observador) {
  if (!itens[0].isIntersecting) return;
  raiz.classList.add('visivel');
  observador.disconnect();
}, { rootMargin: '0px 0px -10% 0px' }).observe(raiz);
