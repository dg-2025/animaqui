if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

const alvo = raiz.querySelector('[data-texto]');
const frase = alvo.textContent;
alvo.classList.add('textoMaquina');
alvo.textContent = '';
let posicao = 0;
const relogio = setInterval(function () {
  posicao += 1;
  alvo.textContent = frase.slice(0, posicao);
  if (posicao >= frase.length) clearInterval(relogio);
}, 55);
