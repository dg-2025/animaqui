// O cometa só gira enquanto a seção está na tela.
new IntersectionObserver(function (itens) {
  raiz.toggleAttribute('data-pausado', !itens[0].isIntersecting);
}).observe(raiz);
