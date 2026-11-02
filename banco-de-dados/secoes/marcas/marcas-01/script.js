const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const GIRO_MAXIMO = 20;

if (!reduzir) {
  // Inclinação 3D que segue o mouse; no toque não inclina
  raiz.querySelectorAll('.celula').forEach((celula) => {
    celula.addEventListener('pointermove', (evento) => {
      if (evento.pointerType !== 'mouse') return;
      const caixa = celula.getBoundingClientRect();
      const x = (evento.clientX - caixa.left) / caixa.width - 0.5;
      const y = (evento.clientY - caixa.top) / caixa.height - 0.5;
      celula.style.setProperty('--giro-y', x * GIRO_MAXIMO + 'deg');
      celula.style.setProperty('--giro-x', y * -GIRO_MAXIMO + 'deg');
    });
    celula.addEventListener('pointerleave', () => {
      celula.style.removeProperty('--giro-y');
      celula.style.removeProperty('--giro-x');
    });
  });

  if ('IntersectionObserver' in window) {
    // Queda e acender quando 20% da estante aparece
    raiz.classList.add('animar');
    const entrada = new IntersectionObserver((entradas) => {
      if (entradas.some((item) => item.isIntersecting)) {
        raiz.classList.add('visivel');
        entrada.disconnect();
      }
    }, { threshold: 0.2 });
    entrada.observe(raiz.querySelector('.estante'));

    // A energia das linhas é um loop decorativo: pausa fora da tela
    const pausaFora = new IntersectionObserver((entradas) => {
      raiz.classList.toggle('foraDaTela', !entradas[entradas.length - 1].isIntersecting);
    });
    pausaFora.observe(raiz);
  }
}
