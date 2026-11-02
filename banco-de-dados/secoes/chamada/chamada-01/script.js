// As manchas e o brilho só rodam enquanto a seção está na tela.
new IntersectionObserver(function (itens) {
  raiz.toggleAttribute('data-pausado', !itens[0].isIntersecting);
}).observe(raiz);
