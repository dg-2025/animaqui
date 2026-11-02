const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const celulas = Array.from(raiz.querySelectorAll('.celula'));
const sufixo = Math.random().toString(36).slice(2, 8);

// Só um cartão aberto por vez; ids únicos para a seção poder aparecer mais de uma vez
celulas.forEach((celula, indice) => {
  const botao = celula.querySelector('.verMais');
  const rotulo = celula.querySelector('.rotuloBotao');
  const descricao = celula.querySelector('.descricao');
  descricao.id = 'galeria04-' + sufixo + '-' + indice;
  botao.setAttribute('aria-controls', descricao.id);

  botao.addEventListener('click', () => {
    const abrir = !celula.classList.contains('expandido');
    celulas.forEach((outra) => {
      outra.classList.remove('expandido');
      outra.querySelector('.verMais').setAttribute('aria-expanded', 'false');
      outra.querySelector('.rotuloBotao').textContent = 'Ver mais';
    });
    if (abrir) {
      celula.classList.add('expandido');
      botao.setAttribute('aria-expanded', 'true');
      rotulo.textContent = 'Ver menos';
    }
  });
});

// Borda elétrica: id de filtro único por seção, parada com movimento reduzido e fora da tela
const svg = raiz.querySelector('.filtroEscondido');
const filtro = svg.querySelector('filter');
if (reduzir) {
  svg.pauseAnimations();
} else {
  filtro.id = 'galeria04Distorcao-' + sufixo;
  raiz.style.setProperty('--filtro-eletrico', 'url(#' + filtro.id + ')');
}

if ('IntersectionObserver' in window) {
  if (!reduzir) {
    const pausaFora = new IntersectionObserver((entradas) => {
      if (entradas[entradas.length - 1].isIntersecting) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
    pausaFora.observe(raiz);

    // Entrada: um cartão sobe atrás do outro
    raiz.classList.add('animar');
    const entrada = new IntersectionObserver((entradas) => {
      if (entradas.some((item) => item.isIntersecting)) {
        raiz.classList.add('visivel');
        entrada.disconnect();
      }
    }, { threshold: 0.1 });
    entrada.observe(raiz);
  }
}
