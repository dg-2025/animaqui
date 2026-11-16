const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lista = raiz.querySelector('.lista');
const vazio = raiz.querySelector('.vazio');
const resumo = raiz.querySelector('.resumo');
const contagem = raiz.querySelector('.contagem');
const total = raiz.querySelector('.resumoTotal');

function pular(elemento) {
  elemento.classList.remove('mudou');
  void elemento.offsetWidth;
  elemento.classList.add('mudou');
}

// Subtotal de cada item = (lanche + bebida) x quantidade; o resumo soma tudo
function atualizar() {
  const itens = [...lista.querySelectorAll('.item:not(.saindo)')];
  let soma = 0;
  let unidades = 0;
  itens.forEach((item) => {
    const qtd = Number(item.querySelector('.qtd').textContent);
    const valor = (parseFloat(item.dataset.preco) + parseFloat(item.dataset.extra)) * qtd;
    item.querySelector('.subtotalValor').textContent = real.format(valor);
    soma += valor;
    unidades += qtd;
  });
  contagem.textContent = unidades === 1 ? '1 item' : unidades + ' itens';
  raiz.querySelector('.resumoSubtotal').textContent = real.format(soma);
  raiz.querySelector('.resumoPontos').textContent = Math.floor(soma) + ' pontos';
  const novo = real.format(soma);
  if (total.textContent !== novo) {
    total.textContent = novo;
    pular(total);
  }
  const semNada = itens.length === 0;
  vazio.hidden = !semNada;
  resumo.hidden = semNada;
  lista.hidden = semNada;
}

function remover(item) {
  const qtd = Number(item.querySelector('.qtd').textContent);
  avisarLoja(-qtd);
  item.classList.add('saindo');
  atualizar();
  setTimeout(() => item.remove(), reduzir ? 0 : 300);
}

lista.addEventListener('click', (evento) => {
  const item = evento.target.closest('.item');
  if (!item || item.classList.contains('saindo')) return;
  if (evento.target.closest('.remover')) {
    remover(item);
    return;
  }
  const botao = evento.target.closest('.botaoQtd');
  if (!botao) return;
  const saida = item.querySelector('.qtd');
  const atual = Number(saida.textContent);
  const novo = Math.min(20, atual + Number(botao.dataset.delta));
  // Chegar a zero tira o item, como na referência
  if (novo === 0) {
    remover(item);
    return;
  }
  if (novo === atual) return;
  saida.textContent = String(novo);
  pular(saida);
  avisarLoja(novo - atual);
  atualizar();
});

atualizar();
