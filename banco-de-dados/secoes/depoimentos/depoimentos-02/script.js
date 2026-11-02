// Coreografia em múltiplos dos tokens de movimento, lidos do CSS na hora de animar
const ABRIR = 3.4; // × --duracao-lenta: o leque abre devagar
const FOLHEAR = 1.3; // × --duracao-lenta: troca de carta
const PASSO_ABRIR = 1.3; // × --duracao-rapida: as das pontas saem primeiro, a do meio por último
const ATRASO_TITULO = 1.3; // × --duracao-lenta: quando o título da chamada começa a subir
const DESLIZE_MINIMO = 45; // px de deslize para trocar de carta

const deck = raiz.querySelector('.deck');
const cartas = Array.from(deck.querySelectorAll('.carta'));
const dica = raiz.querySelector('.dica');
const botaoAnterior = raiz.querySelector('.anterior');
const botaoProximo = raiz.querySelector('.proximo');
const areaPontos = raiz.querySelector('.pontos');

const indiceChamada = cartas.findIndex(function (carta) { return carta.classList.contains('cartaCta'); });
const central = indiceChamada >= 0 ? indiceChamada : Math.floor(cartas.length / 2);
const maiorDistancia = Math.max(central, cartas.length - 1 - central);

let ativo = central;
let aberto = false;

function movimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function lerMs(token, reserva) {
  const valor = getComputedStyle(raiz).getPropertyValue(token).trim();
  const numero = parseFloat(valor);
  if (Number.isNaN(numero)) return reserva;
  return valor.endsWith('ms') ? numero : numero * 1000;
}

function lerCurva() {
  return getComputedStyle(raiz).getPropertyValue('--curva-entrada').trim() || 'ease-out';
}

function poseEmpilhada(diff) {
  return { x: diff * 4, y: 24, giro: diff * 1.5, escala: 0.94, opacidade: 0 };
}

// A distância lateral acompanha o espaço disponível: de 52 px no celular até 200 px no computador
function espacoEntreCartas() {
  const largura = deck.offsetWidth;
  const disponivel = (raiz.clientWidth - largura) / 2;
  return Math.min(largura * 0.77, Math.max(largura * 0.2, disponivel / Math.max(1, maiorDistancia)));
}

function poseNoLeque(diff) {
  const celular = !window.matchMedia('(min-width: 768px)').matches;
  const distancia = Math.abs(diff);
  return {
    x: diff * espacoEntreCartas(),
    y: distancia * (celular ? 8 : 18),
    giro: diff * (celular ? 6.5 : 9),
    escala: diff === 0 ? 1.04 : Math.max(0.82, (celular ? 0.9 : 0.93) - distancia * 0.03),
    opacidade: 1,
  };
}

function paraQuadro(pose) {
  return {
    transform: 'translateX(' + pose.x + 'px) translateY(' + pose.y + 'px) rotate(' + pose.giro + 'deg) scale(' + pose.escala + ')',
    opacity: pose.opacidade,
  };
}

function aplicar(carta, pose) {
  const quadro = paraQuadro(pose);
  carta.style.transform = quadro.transform;
  carta.style.opacity = String(quadro.opacity);
}

// Para o movimento onde ele está, para o próximo partir dali sem pulo.
// As transições de borda e sombra ficam de fora: elas pertencem ao CSS.
function congelar(carta) {
  carta.getAnimations().forEach(function (animacao) {
    if (animacao instanceof CSSTransition) return;
    try { animacao.commitStyles(); } catch (erro) { /* elemento fora da tela: nada a guardar */ }
    animacao.cancel();
  });
}

function mover(carta, pose, duracao, atraso) {
  congelar(carta);
  if (movimentoReduzido()) {
    aplicar(carta, pose);
    return;
  }
  const animacao = carta.animate([paraQuadro(pose)], {
    duration: duracao,
    delay: atraso || 0,
    easing: lerCurva(),
    fill: 'forwards',
  });
  animacao.finished.then(function () {
    animacao.commitStyles();
    animacao.cancel();
  }).catch(function () {});
}

function atualizarInterface() {
  cartas.forEach(function (carta, indice) {
    const eAtiva = indice === ativo;
    carta.classList.toggle('ativa', eAtiva);
    if (eAtiva) carta.setAttribute('aria-current', 'true');
    else carta.removeAttribute('aria-current');
    carta.style.zIndex = String(20 - Math.abs(indice - ativo));
  });
  Array.from(areaPontos.children).forEach(function (ponto, indice) {
    ponto.classList.toggle('pontoAtivo', indice === ativo);
    if (indice === ativo) ponto.setAttribute('aria-current', 'true');
    else ponto.removeAttribute('aria-current');
  });
  botaoAnterior.disabled = ativo === 0;
  botaoProximo.disabled = ativo === cartas.length - 1;
}

function empilhar() {
  ativo = central;
  atualizarInterface();
  cartas.forEach(function (carta, indice) {
    congelar(carta);
    aplicar(carta, poseEmpilhada(indice - central));
  });
}

function abrirLeque() {
  const lenta = lerMs('--duracao-lenta', 700);
  const rapida = lerMs('--duracao-rapida', 150);
  cartas.forEach(function (carta, indice) {
    const diff = indice - central;
    mover(carta, poseNoLeque(diff), lenta * ABRIR, (maiorDistancia - Math.abs(diff)) * rapida * PASSO_ABRIR);
  });
  if (movimentoReduzido()) return;
  // Título da chamada sobe por trás da máscara, uma linha depois da outra
  raiz.querySelectorAll('.linhaTexto').forEach(function (linha, indice) {
    linha.animate([{ transform: 'translateY(120%)' }, { transform: 'translateY(0%)' }], {
      duration: lenta * 1.5,
      delay: lenta * ATRASO_TITULO + indice * rapida * 1.2,
      easing: lerCurva(),
      fill: 'backwards',
    });
  });
}

function irPara(novo) {
  const alvo = Math.max(0, Math.min(cartas.length - 1, novo));
  dica.classList.add('oculta');
  dica.setAttribute('aria-hidden', 'true');
  if (alvo === ativo) return;
  ativo = alvo;
  atualizarInterface();
  const lenta = lerMs('--duracao-lenta', 700);
  cartas.forEach(function (carta, indice) {
    mover(carta, poseNoLeque(indice - ativo), lenta * FOLHEAR);
  });
}

// Pontos: um para cada carta, então acrescentar carta no HTML já basta
cartas.forEach(function (carta, indice) {
  const ponto = document.createElement('button');
  ponto.type = 'button';
  ponto.className = 'ponto';
  ponto.setAttribute('aria-label', 'Ir para o depoimento ' + (indice + 1));
  ponto.addEventListener('click', function () { irPara(indice); });
  areaPontos.appendChild(ponto);
});

botaoAnterior.addEventListener('click', function () { irPara(ativo - 1); });
botaoProximo.addEventListener('click', function () { irPara(ativo + 1); });
raiz.querySelector('.controles').addEventListener('keydown', function (evento) {
  if (evento.key === 'ArrowLeft') irPara(ativo - 1);
  if (evento.key === 'ArrowRight') irPara(ativo + 1);
});

// Deslize com dedo ou mouse; um arraste não conta como clique na carta
let inicioX = 0;
let arrastou = false;
deck.addEventListener('pointerdown', function (evento) {
  inicioX = evento.clientX;
  arrastou = false;
});
deck.addEventListener('pointerup', function (evento) {
  const diferenca = inicioX - evento.clientX;
  if (Math.abs(diferenca) <= DESLIZE_MINIMO) return;
  arrastou = true;
  irPara(ativo + (diferenca > 0 ? 1 : -1));
});

cartas.forEach(function (carta, indice) {
  carta.addEventListener('click', function () {
    if (arrastou) {
      arrastou = false;
      return;
    }
    irPara(indice);
  });
});

// O link da chamada não troca de carta
raiz.querySelectorAll('.botaoCta').forEach(function (link) {
  link.addEventListener('click', function (evento) { evento.stopPropagation(); });
});

// Mudou a largura da tela: as cartas vão direto para a pose certa
window.addEventListener('resize', function () {
  if (!aberto) return;
  cartas.forEach(function (carta, indice) {
    congelar(carta);
    aplicar(carta, poseNoLeque(indice - ativo));
  });
});

empilhar();

// Abre quando o baralho aparece e fecha quando sai, para abrir de novo na volta
new IntersectionObserver(function (entradas) {
  const visivel = entradas[0].isIntersecting;
  raiz.classList.toggle('foraDaTela', !visivel);
  if (visivel && !aberto) {
    aberto = true;
    requestAnimationFrame(abrirLeque);
  } else if (!visivel && aberto && !movimentoReduzido()) {
    aberto = false;
    empilhar();
  }
}, { threshold: 0.25 }).observe(deck);
