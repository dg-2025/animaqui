// Repete cada grupo até cobrir a faixa duas vezes, para o laço não ter emenda em nenhuma largura.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  raiz.querySelectorAll('.faixa').forEach(function (faixa) {
    const trilho = faixa.querySelector('.trilho');
    const grupo = trilho.querySelector('.grupo');
    const larguraGrupo = grupo.getBoundingClientRect().width;
    const larguraMaxima = Math.max(faixa.getBoundingClientRect().width, window.screen.width * 1.2);
    const copias = Math.max(2, Math.ceil(larguraMaxima / larguraGrupo) + 1);
    for (let vez = 1; vez < copias; vez += 1) {
      const copia = grupo.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      trilho.appendChild(copia);
    }
    trilho.style.setProperty('--copias', copias);
  });
}

new IntersectionObserver(function (itens) {
  raiz.classList.toggle('foraDaTela', !itens[0].isIntersecting);
}).observe(raiz);
