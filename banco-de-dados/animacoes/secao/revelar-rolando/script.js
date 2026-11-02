if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

const FOLGA_MAXIMA = 220;
const elementos = raiz.querySelectorAll('[data-anima]');

function medirFolga() {
  const alturaPagina = document.documentElement.scrollHeight;
  elementos.forEach(function (elemento) {
    const fundo = elemento.getBoundingClientRect().bottom + window.scrollY;
    const folga = Math.min(Math.max(alturaPagina - fundo, 0), FOLGA_MAXIMA);
    elemento.style.setProperty('--folga', folga.toFixed(0) + 'px');
  });
}

medirFolga();
new ResizeObserver(medirFolga).observe(document.documentElement);
