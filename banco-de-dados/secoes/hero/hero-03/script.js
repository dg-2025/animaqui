const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Separa o texto em letras aqui, para ele continuar fácil de editar no HTML.
if (!reduzMovimento) {
  raiz.querySelectorAll('[data-letras]').forEach(function (alvo) {
    const frase = alvo.textContent.trim().replace(/\s+/g, ' ');
    alvo.setAttribute('aria-label', frase);
    alvo.textContent = '';
    let indice = 0;
    frase.split(' ').forEach(function (palavra, posicao) {
      if (posicao > 0) alvo.appendChild(document.createTextNode(' '));
      const caixa = document.createElement('span');
      caixa.className = 'palavra';
      caixa.setAttribute('aria-hidden', 'true');
      Array.from(palavra).forEach(function (letra) {
        const pedaco = document.createElement('span');
        pedaco.className = 'letra';
        pedaco.style.setProperty('--i', indice);
        pedaco.textContent = letra;
        caixa.appendChild(pedaco);
        indice += 1;
      });
      alvo.appendChild(caixa);
    });
  });
}

const controle = raiz.querySelector('.controleVideo');
controle.addEventListener('click', function () {
  const pausado = raiz.classList.toggle('pausado');
  controle.setAttribute('aria-label', pausado ? 'Retomar vídeo de fundo' : 'Pausar vídeo de fundo');
});

raiz.querySelector('.indicador').addEventListener('click', function (evento) {
  evento.preventDefault();
  window.scrollTo({
    top: window.scrollY + raiz.getBoundingClientRect().bottom,
    behavior: reduzMovimento ? 'auto' : 'smooth',
  });
});

new IntersectionObserver(function (itens) {
  raiz.classList.toggle('foraDaTela', !itens[0].isIntersecting);
}).observe(raiz);
