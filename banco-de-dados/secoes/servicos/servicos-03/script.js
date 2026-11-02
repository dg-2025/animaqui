if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

const trilho = raiz.querySelector('.trilho');

[...trilho.children].forEach((cartao) => {
  const copia = cartao.cloneNode(true);
  copia.setAttribute('aria-hidden', 'true');
  trilho.appendChild(copia);
});

raiz.classList.add('emLoop');

const observador = new IntersectionObserver((entradas) => {
  raiz.classList.toggle('foraDeTela', !entradas[0].isIntersecting);
});

observador.observe(raiz);
