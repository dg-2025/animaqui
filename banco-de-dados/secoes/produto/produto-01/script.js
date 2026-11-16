const formulario = raiz.querySelector('.colunaOpcoes');
const favorito = raiz.querySelector('.favorito');
const porcao = raiz.querySelector('.porcao');
const qtd = raiz.querySelector('.barraQtd');
const resumo = raiz.querySelector('.barraResumo');
const preco = raiz.querySelector('.barraPreco');
const nomes = { P: 'pequena', M: 'média', G: 'grande' };
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

favorito.addEventListener('click', () => {
  const ligado = favorito.getAttribute('aria-pressed') === 'true';
  favorito.setAttribute('aria-pressed', String(!ligado));
  favorito.setAttribute('aria-label', ligado ? 'Favoritar' : 'Tirar dos favoritos');
});

// Tamanho + adicionais marcados: recalcula preço, porção e o resumo da barra
function atualizar() {
  const tamanho = formulario.querySelector('input[name="tamanho"]:checked');
  const extras = [...formulario.querySelectorAll('input[type="checkbox"]:checked')];
  const total = extras.reduce((soma, extra) => soma + parseFloat(extra.dataset.preco), parseFloat(tamanho.dataset.preco));
  const itens = 1 + extras.length;

  porcao.textContent = tamanho.dataset.porcao;
  qtd.textContent = itens === 1 ? '1 item selecionado' : itens + ' itens selecionados';
  resumo.textContent = ['Pizza Margherita ' + nomes[tamanho.value]].concat(extras.map((extra) => extra.dataset.nome)).join(', ');
  preco.textContent = real.format(total);
  preco.classList.remove('mudou');
  void preco.offsetWidth;
  preco.classList.add('mudou');
}

formulario.addEventListener('change', atualizar);
formulario.addEventListener('submit', (evento) => evento.preventDefault());
atualizar();
