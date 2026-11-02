// A faixa é um loop decorativo: pausa quando a seção sai da tela
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observador = new IntersectionObserver((entradas) => {
    raiz.classList.toggle('foraDaTela', !entradas[entradas.length - 1].isIntersecting);
  });
  observador.observe(raiz);
}
