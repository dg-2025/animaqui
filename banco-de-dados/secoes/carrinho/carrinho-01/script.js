const lista = raiz.querySelector('.itens');
const vazio = raiz.querySelector('.vazio');
const formulario = raiz.querySelector('.premio');
const campo = raiz.querySelector('.cupomCampo');
const aviso = raiz.querySelector('.cupomAviso');
const subtotal = raiz.querySelector('.subtotal');
const linhaDesconto = raiz.querySelector('.linhaDesconto');
const desconto = raiz.querySelector('.desconto');
const total = raiz.querySelector('.total');
const finalizar = raiz.querySelector('.finalizar');
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const cupons = { RAIZ10: 0.1 };
let taxa = 0;

const dois = (n) => String(n).padStart(2, '0');

// Recalcula cada linha e as contas do rodapé
function atualizar() {
  let soma = 0;
  const itens = lista.querySelectorAll('.item:not(.saindo)');
  itens.forEach((item) => {
    const n = Number(item.querySelector('.numero').value);
    const valor = n * parseFloat(item.dataset.preco);
    item.querySelector('.itemPreco').textContent = real.format(valor);
    soma += valor;
  });
  const abatido = soma * taxa;
  subtotal.textContent = real.format(soma);
  linhaDesconto.hidden = taxa === 0;
  desconto.textContent = '− ' + real.format(abatido);
  total.textContent = real.format(soma - abatido);
  vazio.hidden = itens.length > 0;
  finalizar.hidden = itens.length === 0;
}

// Chegar a zero tira o item da sacola
function remover(item) {
  item.classList.add('saindo');
  atualizar();
  if (reduzir) item.remove();
  else item.addEventListener('transitionend', () => item.remove(), { once: true });
}

lista.querySelectorAll('.item').forEach((item) => {
  const numero = item.querySelector('.numero');
  item.querySelector('.menos').addEventListener('click', () => {
    const novo = Number(numero.value) - 1;
    if (novo === 0) return remover(item);
    numero.value = dois(novo);
    atualizar();
  });
  item.querySelector('.mais').addEventListener('click', () => {
    numero.value = dois(Math.min(20, Number(numero.value) + 1));
    atualizar();
  });
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const codigo = campo.value.trim().toUpperCase();
  aviso.classList.remove('certo', 'errado');
  if (cupons[codigo]) {
    taxa = cupons[codigo];
    aviso.textContent = 'Cupom ' + codigo + ' aplicado: ' + taxa * 100 + '% de desconto.';
    aviso.classList.add('certo');
  } else {
    taxa = 0;
    aviso.textContent = codigo ? 'Cupom não encontrado. Confira e tente de novo.' : 'Digite um cupom.';
    aviso.classList.add('errado');
  }
  atualizar();
});

atualizar();
