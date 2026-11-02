const cartoes = raiz.querySelectorAll('.cartaoPlano');
const seletorPerfil = raiz.querySelector('.seletorPerfil');
const botoesPerfil = raiz.querySelectorAll('.botaoPerfil');
const botoesFormato = raiz.querySelectorAll('.botaoFormato');

let perfil = 'individual';
let formato = 'presencial';

function lerMs(token, reserva) {
  const valor = getComputedStyle(raiz).getPropertyValue(token).trim();
  const numero = parseFloat(valor);
  if (Number.isNaN(numero)) return reserva;
  return valor.endsWith('ms') ? numero : numero * 1000;
}

function lerCurva() {
  return getComputedStyle(raiz).getPropertyValue('--curvaTroca').trim() || 'ease-out';
}

function marcar(botoes, atual, chave) {
  botoes.forEach(function (botao) {
    const ligado = botao.dataset[chave] === atual;
    botao.classList.toggle('botaoAtivo', ligado);
    botao.setAttribute('aria-pressed', String(ligado));
  });
}

function mostrarPrecos() {
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tempo = lerMs('--tempoTroca', 300);
  const curva = lerCurva();
  cartoes.forEach(function (cartao, indice) {
    const precos = cartao.getAttribute('data-' + perfil + '-' + formato).split(' ');
    cartao.querySelector('.valorMensal').textContent = 'R$ ' + precos[0];
    cartao.querySelector('.valorTrimestral').textContent = 'R$ ' + precos[1];
    cartao.querySelector('.valorSemestral').textContent = 'R$ ' + precos[2];
    if (reduzido) return;
    // Os preços chegam em onda, da primeira faixa para a última
    cartao.querySelector('.preco').animate(
      [{ opacity: 0, transform: 'translateY(30%)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: tempo, delay: indice * tempo * 0.2, easing: curva, fill: 'backwards' }
    );
    cartao.querySelector('.ciclos').animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: tempo, delay: (indice + 1) * tempo * 0.2, fill: 'backwards' }
    );
  });
}

botoesPerfil.forEach(function (botao, indice) {
  botao.addEventListener('click', function () {
    if (perfil === botao.dataset.perfil) return;
    perfil = botao.dataset.perfil;
    seletorPerfil.dataset.ativo = String(indice);
    marcar(botoesPerfil, perfil, 'perfil');
    mostrarPrecos();
  });
});

botoesFormato.forEach(function (botao) {
  botao.addEventListener('click', function () {
    if (formato === botao.dataset.formato) return;
    formato = botao.dataset.formato;
    marcar(botoesFormato, formato, 'formato');
    mostrarPrecos();
  });
});

new IntersectionObserver(function (itens, observador) {
  if (!itens[0].isIntersecting) return;
  raiz.classList.add('revelada');
  observador.disconnect();
}, { threshold: 0.08 }).observe(raiz.querySelector('.grade'));
