// Separa o título em letras aqui, para o texto continuar fácil de editar no HTML.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const titulo = raiz.querySelector('.titulo');
  titulo.setAttribute('aria-label', titulo.textContent.trim().replace(/\s+/g, ' '));
  let indice = 0;
  Array.from(titulo.childNodes).forEach(function (no) {
    const palavras = no.textContent.trim().split(/\s+/).filter(Boolean);
    if (palavras.length === 0) return;
    const destaque = no.nodeType === 1;
    const pedacos = document.createDocumentFragment();
    palavras.forEach(function (texto) {
      const palavra = document.createElement('span');
      palavra.className = destaque ? 'palavra destaque' : 'palavra';
      palavra.setAttribute('aria-hidden', 'true');
      Array.from(texto).forEach(function (caractere) {
        const letra = document.createElement('span');
        letra.className = 'letra';
        letra.style.setProperty('--i', indice);
        letra.textContent = caractere;
        palavra.appendChild(letra);
        indice += 1;
      });
      pedacos.append(palavra, ' ');
    });
    no.replaceWith(pedacos);
  });
}

new IntersectionObserver(function (itens) {
  raiz.classList.toggle('foraDaTela', !itens[0].isIntersecting);
}).observe(raiz);
