if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

const passos = raiz.querySelector('.passos');
raiz.classList.add('preparado');

const observador = new IntersectionObserver((entradas) => {
  if (!entradas[0].isIntersecting) return;
  raiz.classList.add('visivel');
  observador.disconnect();
}, { threshold: 0.2 });

observador.observe(passos);
