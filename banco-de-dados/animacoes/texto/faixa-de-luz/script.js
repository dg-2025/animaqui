if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

const alvo = raiz.querySelector('[data-texto]');
if (!alvo) return;

const copia = document.createElement('span');
copia.className = 'faixaLuzCopia';
copia.setAttribute('aria-hidden', 'true');
copia.innerHTML = alvo.innerHTML;
if (getComputedStyle(alvo).position === 'static') alvo.classList.add('faixaLuzHospedeiro');
alvo.appendChild(copia);

// Pausa fora da tela.
new IntersectionObserver(function (itens) {
  raiz.toggleAttribute('data-pausado', !itens[0].isIntersecting);
}).observe(alvo);
