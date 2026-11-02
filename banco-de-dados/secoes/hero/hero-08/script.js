// A conversa só começa quando o aparelho aparece. Sem movimento, ela já fica inteira na tela.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const palco = raiz.querySelector('.palcoCelular');
  palco.classList.add('aguardando');
  new IntersectionObserver(function (itens, observador) {
    if (!itens[0].isIntersecting) return;
    palco.classList.remove('aguardando');
    palco.classList.add('tocando');
    observador.disconnect();
  }, { threshold: 0.25 }).observe(palco);
}
