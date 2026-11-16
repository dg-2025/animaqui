const tempo = raiz.querySelector('.tempo');
const selo = raiz.querySelector('.selo');
const carrinho = raiz.querySelector('.carrinho');
const dois = (n) => String(n).padStart(2, '0');

// Contagem regressiva da oferta: 2h14min33s a partir de quando a seção abre
let restante = 2 * 3600 + 14 * 60 + 33;
function mostrarTempo() {
  const h = Math.floor(restante / 3600);
  const m = Math.floor((restante % 3600) / 60);
  const s = restante % 60;
  tempo.textContent = dois(h) + ':' + dois(m) + ':' + dois(s);
  tempo.setAttribute('datetime', 'PT' + h + 'H' + m + 'M' + s + 'S');
}
mostrarTempo();
const relogio = setInterval(() => {
  restante = Math.max(0, restante - 1);
  mostrarTempo();
  if (restante === 0) clearInterval(relogio);
}, 1000);

function contar() {
  let total = 0;
  raiz.querySelectorAll('.numero').forEach((numero) => { total += Number(numero.value); });
  selo.textContent = String(total);
  selo.hidden = total === 0;
  carrinho.setAttribute('aria-label', total === 0 ? 'Carrinho vazio' : 'Carrinho com ' + total + (total === 1 ? ' item' : ' itens'));
  selo.classList.remove('pulou');
  void selo.offsetWidth;
  selo.classList.add('pulou');
}

// O + vira contador; voltar a zero mostra o + de novo
raiz.querySelectorAll('.oferta').forEach((oferta) => {
  const somar = oferta.querySelector('.somar');
  const contador = oferta.querySelector('.contador');
  const numero = oferta.querySelector('.numero');

  function mudar(valor) {
    numero.value = String(valor);
    somar.hidden = valor > 0;
    contador.hidden = valor === 0;
    contar();
  }

  somar.addEventListener('click', () => {
    mudar(1);
    oferta.querySelector('.mais').focus();
  });
  oferta.querySelector('.mais').addEventListener('click', () => mudar(Math.min(20, Number(numero.value) + 1)));
  oferta.querySelector('.menos').addEventListener('click', () => {
    const novo = Number(numero.value) - 1;
    mudar(novo);
    if (novo === 0) somar.focus();
  });
});
