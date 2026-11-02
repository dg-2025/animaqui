const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const faixa = raiz.querySelector('.faixa');
const progresso = raiz.querySelector('.progresso');
const trilho = raiz.querySelector('.trilho');
const setas = raiz.querySelector('.setas');
const anterior = raiz.querySelector('.setaAnterior');
const proxima = raiz.querySelector('.setaProxima');

// Liga e desliga as setas e move a barrinha conforme a posição da faixa (só transform)
function atualizar() {
  const inicio = faixa.scrollLeft <= 4;
  const fim = faixa.scrollLeft + faixa.clientWidth >= faixa.scrollWidth - 4;
  anterior.disabled = inicio;
  proxima.disabled = fim;
  // Se tudo cabe na tela, setas e barrinha nem aparecem
  setas.hidden = inicio && fim;
  trilho.hidden = inicio && fim;
  const fracaoVisivel = Math.min(faixa.clientWidth / faixa.scrollWidth, 1);
  const percorrido = faixa.scrollLeft / Math.max(faixa.scrollWidth - faixa.clientWidth, 1);
  progresso.style.transform = 'translateX(' + percorrido * (1 - fracaoVisivel) * 100 + '%) scaleX(' + fracaoVisivel + ')';
}

atualizar();
faixa.addEventListener('scroll', atualizar, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(atualizar).observe(faixa);
else window.addEventListener('resize', atualizar);

// Seta: rola um item inteiro (largura + espaço entre itens)
function rolar(sentido) {
  const item = faixa.firstElementChild;
  if (!item) return;
  const espaco = parseFloat(getComputedStyle(faixa).columnGap) || 0;
  faixa.scrollBy({ left: sentido * (item.offsetWidth + espaco), behavior: reduzir ? 'auto' : 'smooth' });
}

anterior.addEventListener('click', () => rolar(-1));
proxima.addEventListener('click', () => rolar(1));

// Placeholder de clipe: só um toca por vez, e o botão volta ao play quando a barra termina
function parar(quadro) {
  const botao = quadro.querySelector('.botaoPlay');
  quadro.classList.remove('tocando');
  botao.setAttribute('aria-pressed', 'false');
  botao.setAttribute('aria-label', botao.getAttribute('aria-label').replace('Pausar', 'Reproduzir'));
}

raiz.querySelectorAll('.quadro').forEach((quadro) => {
  const botao = quadro.querySelector('.botaoPlay');
  botao.addEventListener('click', () => {
    if (quadro.classList.contains('tocando')) {
      parar(quadro);
      return;
    }
    raiz.querySelectorAll('.quadro.tocando').forEach(parar);
    quadro.classList.add('tocando');
    botao.setAttribute('aria-pressed', 'true');
    botao.setAttribute('aria-label', botao.getAttribute('aria-label').replace('Reproduzir', 'Pausar'));
  });
  quadro.querySelector('.tempoClipe').addEventListener('animationend', () => parar(quadro));
});

// Entrada em sequência quando a seção aparece
if (!reduzir && 'IntersectionObserver' in window) {
  raiz.classList.add('animar');
  const observador = new IntersectionObserver((entradas) => {
    if (entradas.some((entrada) => entrada.isIntersecting)) {
      raiz.classList.add('visivel');
      observador.disconnect();
    }
  }, { threshold: 0.2 });
  observador.observe(raiz);
}
