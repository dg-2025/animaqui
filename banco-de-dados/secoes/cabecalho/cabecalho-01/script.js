const alternar = raiz.querySelector('.alternar');
const menu = raiz.querySelector('.menu');
alternar.addEventListener('click', function () {
  const aberto = menu.classList.toggle('aberto');
  alternar.setAttribute('aria-expanded', String(aberto));
});
