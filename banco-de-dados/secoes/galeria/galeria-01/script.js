const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const botoes = Array.from(raiz.querySelectorAll('.botaoFoto'));
const total = botoes.length;
const visor = raiz.querySelector('.visor');
const quadro = raiz.querySelector('.quadro');
const contador = raiz.querySelector('.contador');
const tituloVisor = raiz.querySelector('.tituloVisor');
const mosaico = raiz.querySelector('.mosaico');
const rodape = raiz.querySelector('.rodape');

// Distância (px) ou velocidade (px/ms) do arraste que troca de foto, e quanto a foto segue o dedo
const LIMITE_ARRASTE = 60;
const VELOCIDADE_ARRASTE = 0.4;
const ELASTICIDADE = 0.35;

let aberta = 0;
let fechando = false;
let arraste = null;
let rolagemAnterior = '';

const lerToken = (nome) => getComputedStyle(raiz).getPropertyValue(nome).trim();
const lerMs = (nome, reserva) => {
  const valor = lerToken(nome);
  const numero = parseFloat(valor);
  if (Number.isNaN(numero)) return reserva;
  return valor.endsWith('ms') ? numero : numero * 1000;
};

// Entrada em sequência quando a seção aparece
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

function mostrar(indice, direcao) {
  aberta = (indice + total) % total;
  const botao = botoes[aberta];
  const titulo = botao.querySelector('.legenda').textContent;
  quadro.dataset.tom = botao.dataset.tom;
  tituloVisor.textContent = titulo;
  visor.setAttribute('aria-label', titulo);
  contador.textContent = String(aberta + 1).padStart(2, '0') + ' / ' + total;
  // A foto nova entra pelo lado de onde a pessoa veio
  quadro.style.setProperty('--direcao', direcao);
  quadro.classList.remove('entrando');
  void quadro.offsetWidth;
  quadro.classList.add('entrando');
}

function abrir(indice) {
  mostrar(indice, 1);
  rolagemAnterior = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  visor.showModal();
  raiz.querySelector('.botaoFechar').focus();
}

function fechar() {
  if (!visor.open || fechando) return;
  if (reduzir) {
    visor.close();
    return;
  }
  fechando = true;
  const saida = visor.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: lerMs('--duracao-media', 300),
    easing: lerToken('--curva-saida') || 'ease-in',
    fill: 'forwards',
  });
  saida.onfinish = () => {
    visor.close();
    saida.cancel();
    fechando = false;
  };
}

botoes.forEach((botao, indice) => {
  botao.addEventListener('click', () => abrir(indice));
});

raiz.querySelector('.botaoFechar').addEventListener('click', fechar);
raiz.querySelector('.anterior').addEventListener('click', () => mostrar(aberta - 1, -1));
raiz.querySelector('.proxima').addEventListener('click', () => mostrar(aberta + 1, 1));

// Esc passa por aqui para fechar com o mesmo fade
visor.addEventListener('cancel', (evento) => {
  evento.preventDefault();
  fechar();
});

visor.addEventListener('close', () => {
  document.body.style.overflow = rolagemAnterior;
});

visor.addEventListener('keydown', (evento) => {
  if (evento.key === 'ArrowRight') mostrar(aberta + 1, 1);
  if (evento.key === 'ArrowLeft') mostrar(aberta - 1, -1);
});

// Clique fora da caixa do visor fecha
visor.addEventListener('click', (evento) => {
  if (evento.target === visor) fechar();
});

// Arrastar: a foto segue o dedo com resistência e troca ao passar do limite
quadro.addEventListener('pointerdown', (evento) => {
  arraste = { inicioX: evento.clientX, inicioTempo: evento.timeStamp };
  quadro.setPointerCapture(evento.pointerId);
});

quadro.addEventListener('pointermove', (evento) => {
  if (!arraste) return;
  const deslocamento = (evento.clientX - arraste.inicioX) * ELASTICIDADE;
  quadro.style.translate = deslocamento + 'px 0';
});

function soltar(evento) {
  if (!arraste) return;
  const distancia = evento.clientX - arraste.inicioX;
  const velocidade = distancia / Math.max(evento.timeStamp - arraste.inicioTempo, 1);
  const posicaoAtual = quadro.style.translate || '0px 0';
  arraste = null;
  quadro.style.translate = '';

  if (distancia < -LIMITE_ARRASTE || velocidade < -VELOCIDADE_ARRASTE) mostrar(aberta + 1, 1);
  else if (distancia > LIMITE_ARRASTE || velocidade > VELOCIDADE_ARRASTE) mostrar(aberta - 1, -1);
  else if (!reduzir) {
    quadro.animate([{ translate: posicaoAtual }, { translate: '0px 0' }], {
      duration: lerMs('--duracao-media', 300),
      easing: lerToken('--curva-entrada') || 'ease-out',
    });
  }
}

quadro.addEventListener('pointerup', soltar);
quadro.addEventListener('pointercancel', soltar);

// Ver mais: mostra o excedente, leva o foco para a primeira foto nova e some
raiz.querySelector('.botaoMais').addEventListener('click', () => {
  const primeiraNova = botoes.find((botao) => botao.offsetParent === null);
  mosaico.classList.add('expandido');
  rodape.hidden = true;
  if (primeiraNova) primeiraNova.focus();
});
