let naTela = true;

new IntersectionObserver(function (itens) {
  naTela = itens[0].isIntersecting;
  raiz.classList.toggle('foraDaTela', !naTela);
}).observe(raiz);

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

// Paralaxe do mouse. Usa a propriedade translate para somar com o transform das animações da plataforma.
const camadas = [
  { elemento: raiz.querySelector('.titulo'), forca: 10 },
  { elemento: raiz.querySelector('.subtitulo'), forca: 5 },
  { elemento: raiz.querySelector('.camadaEspiral'), forca: 15 },
  { elemento: raiz.querySelector('.camadaIcones'), forca: -35 },
];
const telaLarga = window.matchMedia('(min-width: 768px)');
let quadro = 0;
let mouseX = 0;
let mouseY = 0;

function moverCamadas() {
  quadro = 0;
  camadas.forEach(function (camada) {
    camada.elemento.style.translate = (mouseX * camada.forca).toFixed(1) + 'px ' + (mouseY * camada.forca).toFixed(1) + 'px';
  });
}

window.addEventListener('mousemove', function (evento) {
  if (!naTela || !telaLarga.matches) return;
  mouseX = (evento.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (evento.clientY / window.innerHeight - 0.5) * 2;
  if (!quadro) quadro = requestAnimationFrame(moverCamadas);
}, { passive: true });

// De vez em quando o destaque do título dá uma falha rápida.
const destaque = raiz.querySelector('.metalico');
setInterval(function () {
  if (!naTela || Math.random() > 0.3) return;
  destaque.animate([
    { transform: 'translate(0, 0) skewX(0deg)', opacity: 1 },
    { transform: 'translate(-3px, 1px) skewX(8deg)', opacity: 0.7 },
    { transform: 'translate(3px, -1px) skewX(-6deg)', opacity: 1 },
    { transform: 'translate(-1px, 0) skewX(3deg)', opacity: 0.8 },
    { transform: 'translate(0, 0) skewX(0deg)', opacity: 1 },
  ], { duration: 200, easing: 'steps(4, end)' });
}, 3000);
