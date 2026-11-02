const MESES_PAGOS_NO_ANUAL = 10; // o anual paga 10 meses e leva 12

const trilho = raiz.querySelector('.trilho');
const area = raiz.querySelector('.area');
const opcoes = raiz.querySelectorAll('.opcao');
const pontos = Array.from(raiz.querySelectorAll('.ponto'));
const moldura = raiz.querySelector('.moldura');
const itens = Array.from(trilho.children);
const indiceDestaque = Math.max(0, itens.findIndex(function (item) { return item.classList.contains('itemDestaque'); }));

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

function formatar(valor) {
  const arredondado = Math.round(valor * 100) / 100;
  return arredondado.toLocaleString('pt-BR', {
    minimumFractionDigits: Number.isInteger(arredondado) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function trocarPeriodo(periodo) {
  opcoes.forEach(function (opcao) {
    const ligada = opcao.dataset.periodo === periodo;
    opcao.classList.toggle('opcaoAtiva', ligada);
    opcao.setAttribute('aria-pressed', String(ligada));
  });
  raiz.querySelectorAll('.cartao').forEach(function (cartao) {
    const valor = cartao.querySelector('.valor');
    const mensal = Number(valor.dataset.mensal);
    const total = mensal * MESES_PAGOS_NO_ANUAL;
    valor.textContent = formatar(periodo === 'mensal' ? mensal : total / 12);
    cartao.querySelector('.detalhePreco').textContent = periodo === 'mensal'
      ? 'Cancele quando quiser'
      : '12x no cartão ou R$ ' + formatar(total) + ' à vista';
    if (reduzido()) return;
    valor.animate(
      [{ opacity: 0, transform: 'translateY(40%)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: lerMs('--tempoTroca', 300), easing: lerCurva() }
    );
  });
}

opcoes.forEach(function (opcao) {
  opcao.addEventListener('click', function () { trocarPeriodo(opcao.dataset.periodo); });
});

// Carrossel do celular: centraliza o cartão pedido dentro do trilho
function centralizar(indice, suave) {
  const item = itens[indice];
  trilho.scrollTo({
    left: item.offsetLeft - (trilho.clientWidth - item.clientWidth) / 2,
    behavior: suave && !reduzido() ? 'smooth' : 'auto',
  });
}

function marcarPonto(indice) {
  pontos.forEach(function (ponto, i) {
    ponto.classList.toggle('pontoAtivo', i === indice);
    if (i === indice) ponto.setAttribute('aria-current', 'true');
    else ponto.removeAttribute('aria-current');
  });
}

pontos.forEach(function (ponto, indice) {
  ponto.addEventListener('click', function () { centralizar(indice, true); });
});

// Descobre qual cartão está no meio do trilho para acender o ponto certo
trilho.addEventListener('scroll', function () {
  const meio = trilho.scrollLeft + trilho.clientWidth / 2;
  let maisPerto = 0;
  let menorDistancia = Infinity;
  itens.forEach(function (item, indice) {
    const distancia = Math.abs(item.offsetLeft + item.clientWidth / 2 - meio);
    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      maisPerto = indice;
    }
  });
  marcarPonto(maisPerto);
}, { passive: true });

// No celular a seção abre já no plano em destaque; espera o primeiro quadro para ter a largura final
requestAnimationFrame(function () {
  if (trilho.scrollWidth > trilho.clientWidth) centralizar(indiceDestaque, false);
});

new IntersectionObserver(function (entradas, observador) {
  if (!entradas[0].isIntersecting) return;
  raiz.classList.add('revelada');
  observador.disconnect();
}, { threshold: 0.08 }).observe(area);

// O cometa para de girar quando sai da tela
new IntersectionObserver(function (entradas) {
  moldura.toggleAttribute('data-pausado', !entradas[0].isIntersecting);
}).observe(moldura);
