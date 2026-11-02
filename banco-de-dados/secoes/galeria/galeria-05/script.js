const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const visor = raiz.querySelector('.visor');
const quadro = raiz.querySelector('.quadro');
const tituloVisor = raiz.querySelector('.tituloVisor');
let rolagemAnterior = '';

raiz.querySelectorAll('.cartao').forEach((cartao) => {
  cartao.addEventListener('click', () => {
    const titulo = cartao.querySelector('.nomeFoto').textContent;
    quadro.dataset.tom = cartao.dataset.tom;
    tituloVisor.textContent = titulo;
    visor.setAttribute('aria-label', titulo);
    rolagemAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    visor.showModal();
    raiz.querySelector('.botaoFechar').focus();
  });
});

raiz.querySelector('.botaoFechar').addEventListener('click', () => visor.close());

// Clique fora da foto fecha; Esc já é tratado pelo próprio dialog
visor.addEventListener('click', (evento) => {
  if (!evento.target.closest('.quadro, .tituloVisor')) visor.close();
});

visor.addEventListener('close', () => {
  document.body.style.overflow = rolagemAnterior;
});

// Entrada em sequência quando a grade aparece
if (!reduzir && 'IntersectionObserver' in window) {
  raiz.classList.add('animar');
  const observador = new IntersectionObserver((entradas) => {
    if (entradas.some((entrada) => entrada.isIntersecting)) {
      raiz.classList.add('visivel');
      observador.disconnect();
    }
  }, { threshold: 0.15 });
  observador.observe(raiz);
}
