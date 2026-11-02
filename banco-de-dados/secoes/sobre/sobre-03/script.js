const botao = raiz.querySelector('.play');
let naTela = false;
let ligado = true;

function aplicar() {
  raiz.classList.toggle('rodando', naTela && ligado);
  botao.dataset.ligado = String(ligado);
  botao.setAttribute('aria-label', ligado ? 'Pausar o movimento de fundo' : 'Retomar o movimento de fundo');
}

botao.addEventListener('click', () => {
  ligado = !ligado;
  aplicar();
});

const observador = new IntersectionObserver((entradas) => {
  naTela = entradas[0].isIntersecting;
  aplicar();
});

observador.observe(raiz);
