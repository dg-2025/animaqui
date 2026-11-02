const abas = raiz.querySelectorAll('.aba');
const curvas = raiz.querySelector('.curvas');
const linha = raiz.querySelector('.linha');
const area = raiz.querySelector('.area');
const valores = raiz.querySelectorAll('.valor');
const frase = raiz.querySelector('.frase');
const nomePlano = raiz.querySelector('.nomePlano');

function reduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function lerMs(token, reserva) {
  const valor = getComputedStyle(raiz).getPropertyValue(token).trim();
  const numero = parseFloat(valor);
  if (Number.isNaN(numero)) return reserva;
  return valor.endsWith('ms') ? numero : numero * 1000;
}

function lerCurva() {
  return getComputedStyle(raiz).getPropertyValue('--curvaTroca').trim() || 'ease-out';
}

function lerAlturas(aba) {
  return aba.dataset.curva.split(' ').map(Number);
}

function desenhar(y) {
  const caminho = 'M 0 ' + y[0] + ' Q 70 ' + y[1] + ', 140 ' + y[2] + ' T 280 ' + y[3] + ' T 420 ' + y[4];
  linha.setAttribute('d', caminho);
  area.setAttribute('d', caminho + ' L 420 140 L 0 140 Z');
}

let alturas = lerAlturas(abas[0]);
let quadro = 0;

// Redesenha a curva ponto a ponto: trocar de aba no meio do movimento continua de onde parou
function animarCurva(destino) {
  cancelAnimationFrame(quadro);
  if (reduzido()) {
    alturas = destino;
    desenhar(alturas);
    return;
  }
  const origem = alturas;
  const inicio = performance.now();
  const DURACAO = lerMs('--tempoTroca', 700) * 1.2;
  function passo(agora) {
    const t = Math.min(1, (agora - inicio) / DURACAO);
    const suave = 1 - Math.pow(1 - t, 3);
    alturas = origem.map(function (y, i) { return y + (destino[i] - y) * suave; });
    desenhar(alturas);
    if (t < 1) quadro = requestAnimationFrame(passo);
  }
  quadro = requestAnimationFrame(passo);
}

function surgir(elemento, atraso) {
  if (reduzido()) return;
  elemento.animate(
    [{ opacity: 0, transform: 'translateY(30%)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: lerMs('--tempoTroca', 700) * 0.6, delay: atraso, easing: lerCurva(), fill: 'backwards' }
  );
}

abas.forEach(function (aba) {
  aba.addEventListener('click', function () {
    if (aba.classList.contains('abaAtiva')) return;
    abas.forEach(function (outra) {
      const ligada = outra === aba;
      outra.classList.toggle('abaAtiva', ligada);
      outra.setAttribute('aria-pressed', String(ligada));
    });
    animarCurva(lerAlturas(aba));
    const metricas = aba.dataset.metricas.split('|');
    valores.forEach(function (valor, indice) {
      valor.textContent = metricas[indice];
      surgir(valor, indice * lerMs('--tempoTroca', 700) * 0.12);
    });
    frase.textContent = aba.dataset.frase;
    nomePlano.textContent = aba.textContent.trim();
  });
});

// A curva se desenha da esquerda para a direita quando o painel aparece
if (!reduzido()) {
  curvas.style.clipPath = 'inset(0 100% 0 0)';
  new IntersectionObserver(function (itens, observador) {
    if (!itens[0].isIntersecting) return;
    observador.disconnect();
    curvas.style.clipPath = '';
    curvas.animate(
      [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
      { duration: lerMs('--tempoTroca', 700) * 2, easing: lerCurva() }
    );
  }, { threshold: 0.25 }).observe(raiz.querySelector('.painel'));
}
