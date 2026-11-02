if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

const alvo = raiz.querySelector('[data-texto]');
const frase = alvo ? alvo.textContent.trim() : '';
if (!frase) return;

alvo.setAttribute('aria-label', frase);
alvo.textContent = '';
frase.split(/\s+/).forEach(function (palavra, indice) {
  if (indice > 0) alvo.appendChild(document.createTextNode(' '));
  const caixa = document.createElement('span');
  caixa.className = 'textoPalavraCaixa';
  caixa.setAttribute('aria-hidden', 'true');
  const interno = document.createElement('span');
  interno.className = 'textoPalavra';
  interno.style.setProperty('--i', indice);
  interno.textContent = palavra;
  caixa.appendChild(interno);
  alvo.appendChild(caixa);
});

new IntersectionObserver(function (itens, observador) {
  if (!itens[0].isIntersecting) return;
  alvo.classList.add('visivel');
  observador.disconnect();
}).observe(alvo);
