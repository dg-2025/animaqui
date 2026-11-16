const filtros = raiz.querySelectorAll('.filtro');
const itens = raiz.querySelectorAll('.item');
const pedido = raiz.querySelector('.pedido');
const pedidoQtd = raiz.querySelector('.pedidoQtd');
const pedidoTotal = raiz.querySelector('.pedidoTotal');
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

filtros.forEach((filtro) => {
  filtro.addEventListener('click', () => {
    const escolhido = filtro.dataset.filtro;
    filtros.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === filtro)));
    itens.forEach((item) => {
      item.hidden = escolhido !== 'todos' && item.dataset.categoria !== escolhido;
    });
  });
});

// Soma tudo o que tem quantidade e mostra a barra do pedido
function atualizarPedido() {
  let quantidade = 0;
  let soma = 0;
  itens.forEach((item) => {
    const n = Number(item.querySelector('.numero').value);
    quantidade += n;
    soma += n * parseFloat(item.dataset.preco);
  });
  pedido.hidden = quantidade === 0;
  pedidoQtd.textContent = quantidade === 1 ? '1 item' : quantidade + ' itens';
  pedidoTotal.textContent = real.format(soma);
}

itens.forEach((item) => {
  const numero = item.querySelector('.numero');
  const menos = item.querySelector('.menos');
  const mais = item.querySelector('.mais');

  function mudar(passo) {
    const novo = Math.max(0, Math.min(20, Number(numero.value) + passo));
    numero.value = String(novo);
    menos.disabled = novo === 0;
    mais.disabled = novo === 20;
    numero.classList.remove('mudou');
    void numero.offsetWidth;
    numero.classList.add('mudou');
    atualizarPedido();
  }

  numero.value = '0';
  menos.addEventListener('click', () => mudar(-1));
  mais.addEventListener('click', () => mudar(1));
});
