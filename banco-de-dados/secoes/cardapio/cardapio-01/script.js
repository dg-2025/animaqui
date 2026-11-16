const filtros = raiz.querySelectorAll('.filtro');
const itens = raiz.querySelectorAll('.item');
const sacola = raiz.querySelector('.sacola');
const qtd = raiz.querySelector('.sacolaQtd');
const total = raiz.querySelector('.sacolaTotal');
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
let quantidade = 0;
let soma = 0;

// Filtro por categoria: esconde os itens de outra categoria
filtros.forEach((filtro) => {
  filtro.addEventListener('click', () => {
    const escolhido = filtro.dataset.filtro;
    filtros.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === filtro)));
    itens.forEach((item) => {
      item.hidden = escolhido !== 'todos' && item.dataset.categoria !== escolhido;
    });
  });
});

// Cada toque no + soma o item na sacola, que aparece no primeiro toque
itens.forEach((item) => {
  const botao = item.querySelector('.adicionar');
  const preco = parseFloat(item.querySelector('.itemPreco').dataset.preco);
  botao.addEventListener('click', () => {
    quantidade += 1;
    soma += preco;
    qtd.textContent = quantidade === 1 ? '1 item' : quantidade + ' itens';
    total.textContent = real.format(soma);
    sacola.hidden = false;
    botao.classList.remove('somou');
    void botao.offsetWidth;
    botao.classList.add('somou');
  });
});
