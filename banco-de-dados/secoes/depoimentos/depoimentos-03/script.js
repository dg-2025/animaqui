const trilho = raiz.querySelector('.trilho');
const barra = raiz.querySelector('.barraProgresso');
const anterior = raiz.querySelector('.anterior');
const proximo = raiz.querySelector('.proximo');

function atualizar() {
  const total = trilho.scrollWidth - trilho.clientWidth;
  const fracao = total > 0 ? trilho.scrollLeft / total : 0;
  const visivel = trilho.clientWidth / trilho.scrollWidth;
  barra.style.transform = 'translateX(' + fracao * (1 - visivel) * 100 + '%) scaleX(' + visivel + ')';
  anterior.disabled = trilho.scrollLeft <= 4;
  proximo.disabled = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 4;
}

function rolar(direcao) {
  const cartao = trilho.querySelector('.cartao');
  const vao = parseFloat(getComputedStyle(trilho).columnGap) || 0;
  const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  trilho.scrollBy({ left: direcao * (cartao.offsetWidth + vao), behavior: suave ? 'smooth' : 'auto' });
}

anterior.addEventListener('click', function () { rolar(-1); });
proximo.addEventListener('click', function () { rolar(1); });
trilho.addEventListener('scroll', atualizar, { passive: true });
window.addEventListener('resize', atualizar);
atualizar();
