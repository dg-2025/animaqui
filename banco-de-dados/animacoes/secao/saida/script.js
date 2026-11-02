if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

raiz.classList.add('animaSaida');
function atualizar() {
  const caixa = raiz.getBoundingClientRect();
  const saiu = Math.min(Math.max(-caixa.top / Math.max(caixa.height, 1), 0), 1);
  raiz.style.opacity = String(1 - saiu);
  raiz.style.transform = 'scale(' + (1 - saiu * 0.12) + ')';
}
window.addEventListener('scroll', atualizar, { passive: true });
atualizar();
