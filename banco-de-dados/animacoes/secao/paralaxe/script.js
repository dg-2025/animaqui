if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

raiz.classList.add('animaParalaxe');
const elementos = raiz.querySelectorAll('[data-anima]');
function atualizar() {
  const caixa = raiz.getBoundingClientRect();
  const centro = caixa.top + caixa.height / 2 - window.innerHeight / 2;
  elementos.forEach(function (elemento, indice) {
    elemento.style.transform = 'translateY(' + (centro * (0.08 + indice * 0.05)).toFixed(1) + 'px)';
  });
}
window.addEventListener('scroll', atualizar, { passive: true });
atualizar();
