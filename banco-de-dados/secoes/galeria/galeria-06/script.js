const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const botoes = Array.from(raiz.querySelectorAll('.botaoFoto'));
const total = botoes.length;
const visor = raiz.querySelector('.visor');
const quadro = raiz.querySelector('.quadro');
const textoVisor = raiz.querySelector('.textoVisor');
const posicao = raiz.querySelector('.posicao');
let aberta = 0;
let rolagemAnterior = '';

function mostrar(indice) {
  aberta = (indice + total) % total;
  const botao = botoes[aberta];
  const legenda = botao.querySelector('.textoLegenda').textContent;
  quadro.dataset.tom = botao.dataset.tom;
  textoVisor.textContent = legenda;
  posicao.textContent = '(' + (aberta + 1) + ' de ' + total + ')';
  visor.setAttribute('aria-label', legenda);
}

botoes.forEach((botao, indice) => {
  botao.addEventListener('click', () => {
    mostrar(indice);
    rolagemAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    visor.showModal();
    raiz.querySelector('.botaoFechar').focus();
  });
});

raiz.querySelector('.botaoFechar').addEventListener('click', () => visor.close());
raiz.querySelector('.navEsquerda').addEventListener('click', () => mostrar(aberta - 1));
raiz.querySelector('.navDireita').addEventListener('click', () => mostrar(aberta + 1));

visor.addEventListener('keydown', (evento) => {
  if (evento.key === 'ArrowRight') mostrar(aberta + 1);
  if (evento.key === 'ArrowLeft') mostrar(aberta - 1);
});

// Clique fora da moldura fecha; Esc já é tratado pelo próprio dialog
visor.addEventListener('click', (evento) => {
  if (!evento.target.closest('.moldura, .legendaVisor')) visor.close();
});

visor.addEventListener('close', () => {
  document.body.style.overflow = rolagemAnterior;
});

// Ver mais, só no celular: mostra o resto e leva o foco para a primeira foto nova
raiz.querySelector('.botaoMais').addEventListener('click', () => {
  const primeiraNova = botoes.find((botao) => botao.offsetParent === null);
  raiz.querySelector('.mosaico').classList.add('expandido');
  raiz.querySelector('.rodape').hidden = true;
  if (primeiraNova) primeiraNova.focus();
});

// Entrada leve das peças; o zoom de cada foto é ligado à rolagem no CSS
if (!reduzir && 'IntersectionObserver' in window) {
  raiz.classList.add('animar');
  const observador = new IntersectionObserver((entradas) => {
    if (entradas.some((entrada) => entrada.isIntersecting)) {
      raiz.classList.add('visivel');
      observador.disconnect();
    }
  }, { threshold: 0.1 });
  observador.observe(raiz);
}
