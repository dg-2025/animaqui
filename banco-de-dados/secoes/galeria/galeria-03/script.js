const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const controle = raiz.querySelector('.controle');

if (reduzir) {
  // Sem movimento não há o que pausar
  controle.hidden = true;
} else {
  controle.addEventListener('click', () => {
    const pausado = raiz.classList.toggle('pausado');
    controle.setAttribute('aria-label', pausado ? 'Reproduzir filme' : 'Pausar filme');
  });
}

if ('IntersectionObserver' in window) {
  // O filme só corre enquanto a seção está na tela
  const pausaFora = new IntersectionObserver((entradas) => {
    raiz.classList.toggle('foraDaTela', !entradas[entradas.length - 1].isIntersecting);
  }, { threshold: 0.1 });
  pausaFora.observe(raiz);

  // O texto sobe em cascata quando a seção aparece
  if (!reduzir) {
    raiz.classList.add('animar');
    const entrada = new IntersectionObserver((entradas) => {
      if (entradas.some((item) => item.isIntersecting)) {
        raiz.classList.add('visivel');
        entrada.disconnect();
      }
    }, { threshold: 0.25 });
    entrada.observe(raiz);
  }
}
