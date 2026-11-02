const itens = raiz.querySelectorAll('.item');

itens.forEach(function (item) {
  item.querySelector('.botaoPergunta').addEventListener('click', function () {
    const abrir = !item.classList.contains('aberto');
    itens.forEach(function (outro) {
      const ligado = abrir && outro === item;
      outro.classList.toggle('aberto', ligado);
      outro.querySelector('.botaoPergunta').setAttribute('aria-expanded', String(ligado));
    });
  });
});

new IntersectionObserver(function (entradas, observador) {
  if (!entradas[0].isIntersecting) return;
  raiz.classList.add('revelada');
  observador.disconnect();
}, { threshold: 0.15 }).observe(raiz.querySelector('.lista'));
