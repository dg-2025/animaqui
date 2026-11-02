if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

const alvo = raiz.querySelector('[data-texto]');
const frase = alvo.textContent;
alvo.setAttribute('aria-label', frase);
alvo.textContent = '';
Array.from(frase).forEach(function (letra, indice) {
  const caixa = document.createElement('span');
  caixa.className = 'textoLetra';
  caixa.setAttribute('aria-hidden', 'true');
  caixa.style.setProperty('--i', indice);
  caixa.textContent = letra;
  alvo.appendChild(caixa);
});
