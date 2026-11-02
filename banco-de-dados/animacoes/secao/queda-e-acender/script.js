if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

const elementos = raiz.querySelectorAll('[data-anima]');
if (elementos.length === 0) return;

const ultimo = elementos[elementos.length - 1];
elementos.forEach(function (elemento, indice) {
  elemento.style.setProperty('--i', indice);
  elemento.style.setProperty('--total', elementos.length);
  elemento.style.setProperty('--opacidade-final', getComputedStyle(elemento).opacity);
});
raiz.classList.add('animaQueda');

// Ao terminar, devolve os elementos ao estado natural (hover e transições voltam a valer).
raiz.addEventListener('animationend', function aoTerminar(evento) {
  if (evento.target !== ultimo || evento.animationName !== 'quedaAcende') return;
  raiz.classList.remove('animaQueda', 'visivel');
  raiz.removeEventListener('animationend', aoTerminar);
});

new IntersectionObserver(function (itens, observador) {
  if (!itens[0].isIntersecting) return;
  raiz.classList.add('visivel');
  observador.disconnect();
}, { rootMargin: '0px 0px -10% 0px' }).observe(raiz);
