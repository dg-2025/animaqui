new IntersectionObserver(function (itens, observador) {
  if (!itens[0].isIntersecting) return;
  raiz.classList.add('revelada');
  observador.disconnect();
}, { threshold: 0.15 }).observe(raiz.querySelector('.grade'));
