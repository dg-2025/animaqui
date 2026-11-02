if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

const SEM_FILHOS = /^(img|input|textarea|select|video|audio|svg|canvas|iframe|hr|br)$/i;
const TRANSPARENTE = /^rgba\(.*, 0\)$|\/ 0\)$|^transparent$/;

// A luz só faz sentido onde há superfície: num título solto apareceria um retângulo.
function temSuperficie(elemento) {
  if (SEM_FILHOS.test(elemento.tagName)) return false;
  const estilo = getComputedStyle(elemento);
  return estilo.backgroundImage !== 'none'
    || !TRANSPARENTE.test(estilo.backgroundColor)
    || (parseFloat(estilo.borderTopWidth) > 0 && parseFloat(estilo.borderLeftWidth) > 0);
}

const comSuperficie = Array.from(raiz.querySelectorAll('[data-anima]')).filter(temSuperficie);
const hospedeiros = comSuperficie.filter(function (elemento) {
  return !comSuperficie.some(function (outro) { return outro !== elemento && outro.contains(elemento); });
});

// Superfícies pequenas (uma etiqueta num hero) mal mostrariam a luz: aí ela passa sobre a seção inteira.
function area(elemento) {
  const caixa = elemento.getBoundingClientRect();
  return caixa.width * caixa.height;
}
const secao = raiz.firstElementChild;
const areaCoberta = hospedeiros.reduce(function (soma, elemento) { return soma + area(elemento); }, 0);
const alvos = secao && areaCoberta < area(secao) * 0.25 ? [secao] : hospedeiros;

alvos.forEach(function (elemento, indice) {
  if (getComputedStyle(elemento).position === 'static') elemento.classList.add('reflexoHospedeiro');
  const camada = document.createElement('span');
  camada.className = 'reflexoCamada';
  camada.setAttribute('aria-hidden', 'true');
  camada.style.setProperty('--i', indice);
  if (elemento === secao) camada.style.setProperty('--forca', '10%'); // sobre a seção inteira, bem mais discreta
  elemento.appendChild(camada);
});

// Pausa fora da tela.
new IntersectionObserver(function (itens) {
  raiz.toggleAttribute('data-pausado', !itens[0].isIntersecting);
}).observe(raiz);
