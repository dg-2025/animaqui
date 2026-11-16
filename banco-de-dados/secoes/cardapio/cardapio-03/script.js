const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const cards = [...raiz.querySelectorAll('.card')];
const filtros = [...raiz.querySelectorAll('.filtro')];
const alternar = raiz.querySelector('.filtroAlternar');
const filtroAtual = raiz.querySelector('.filtroAtual');
const verMaisCaixa = raiz.querySelector('.verMaisCaixa');
const verMais = raiz.querySelector('.verMais');
const verMaisTexto = raiz.querySelector('.verMaisTexto');
const pedido = raiz.querySelector('.pedido');
const pedidoQtd = raiz.querySelector('.pedidoQtd');
const pedidoTotal = raiz.querySelector('.pedidoTotal');
const detalhe = raiz.querySelector('.detalhe');
const passoNumero = raiz.querySelector('.passoNumero');
const passoMenos = raiz.querySelector('.passoMenos');
const personalizar = raiz.querySelector('.detalhePersonalizar');
// Dentro de uma loja com a página do lanche, "Pedir" num lanche leva à personalização
const temPaginaLanche = () => Boolean(document.querySelector('.lojaPagina[data-pagina="lanche"]'));
let categoria = 'todos';
let expandido = false;
let itens = 0;
let soma = 0;
let aberto = null;
let qtdDetalhe = 1;

const dados = (card) => ({
  nome: card.querySelector('.cardNome').textContent,
  preco: parseFloat(card.dataset.preco),
});

// Em "Todos" mostra 8 itens e o botão "Ver mais"; numa categoria mostra tudo dela
function filtrar() {
  const extras = cards.filter((card) => card.hasAttribute('data-extra'));
  cards.forEach((card) => {
    const daCategoria = categoria === 'todos' || card.dataset.categoria === categoria;
    const escondidoPeloLimite = categoria === 'todos' && !expandido && card.hasAttribute('data-extra');
    card.hidden = !daCategoria || escondidoPeloLimite;
  });
  verMaisCaixa.hidden = categoria !== 'todos';
  verMais.setAttribute('aria-expanded', String(expandido));
  verMaisTexto.textContent = expandido ? 'Ver menos' : 'Ver mais ' + extras.length + ' itens';
}

filtros.forEach((filtro) => {
  filtro.addEventListener('click', () => {
    categoria = filtro.dataset.filtro;
    expandido = false;
    filtros.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === filtro)));
    filtroAtual.textContent = filtro.textContent.trim();
    alternar.setAttribute('aria-expanded', 'false');
    filtrar();
  });
});

alternar.addEventListener('click', () => {
  alternar.setAttribute('aria-expanded', String(alternar.getAttribute('aria-expanded') !== 'true'));
});

verMais.addEventListener('click', () => {
  expandido = !expandido;
  filtrar();
});

// Soma no pedido da seção e avisa a loja
function somar(card, quantidade) {
  const item = dados(card);
  itens += quantidade;
  soma += item.preco * quantidade;
  pedido.hidden = false;
  pedidoQtd.textContent = itens === 1 ? '1 item no pedido' : itens + ' itens no pedido';
  pedidoTotal.textContent = real.format(soma);
  avisarLoja(quantidade);
  const botao = card.querySelector('.pedir');
  botao.textContent = 'Adicionado';
  botao.classList.remove('foi');
  void botao.offsetWidth;
  botao.classList.add('foi');
  clearTimeout(botao.tempo);
  botao.tempo = setTimeout(() => { botao.textContent = 'Pedir'; }, 1400);
}

function mostrarQtd() {
  passoNumero.textContent = String(qtdDetalhe);
  passoMenos.disabled = qtdDetalhe === 1;
  raiz.querySelector('.detalheTotal').textContent = real.format(dados(aberto).preco * qtdDetalhe);
}

function abrirDetalhe(card) {
  aberto = card;
  qtdDetalhe = 1;
  const item = dados(card);
  const foto = detalhe.querySelector('.detalheFoto');
  foto.src = card.querySelector('img').src;
  foto.alt = item.nome;
  detalhe.querySelector('.detalheNome').textContent = item.nome;
  detalhe.querySelector('.detalhePreco').textContent = real.format(item.preco);
  detalhe.querySelector('.detalheKcal').textContent = card.dataset.kcal;
  detalhe.querySelector('.detalheDescricao').textContent = card.querySelector('.cardDescricao').textContent;
  detalhe.querySelector('.detalheIngredientes h4').textContent = card.dataset.categoria === 'bebidas' ? 'Informações' : 'Ingredientes';
  const lista = detalhe.querySelector('.detalheIngredientes ul');
  lista.replaceChildren(...card.dataset.ingredientes.split('|').map((texto) => {
    const li = document.createElement('li');
    li.textContent = texto;
    return li;
  }));
  personalizar.hidden = !(card.dataset.categoria === 'lanches' && temPaginaLanche());
  mostrarQtd();
  if (typeof detalhe.showModal === 'function') detalhe.showModal();
  else detalhe.setAttribute('open', '');
}

function fecharDetalhe() {
  if (typeof detalhe.close === 'function') detalhe.close();
  else detalhe.removeAttribute('open');
}

cards.forEach((card) => {
  card.querySelector('.cardFoto').addEventListener('click', () => abrirDetalhe(card));
  card.querySelector('.pedir').addEventListener('click', () => {
    if (card.dataset.categoria === 'lanches' && temPaginaLanche()) {
      const atalho = document.createElement('a');
      atalho.dataset.ir = 'lanche';
      atalho.hidden = true;
      raiz.append(atalho);
      atalho.click();
      atalho.remove();
      return;
    }
    somar(card, 1);
  });
});

passoMenos.addEventListener('click', () => { qtdDetalhe = Math.max(1, qtdDetalhe - 1); mostrarQtd(); });
raiz.querySelector('.passoMais').addEventListener('click', () => { qtdDetalhe = Math.min(20, qtdDetalhe + 1); mostrarQtd(); });
raiz.querySelector('.detalheAdicionar').addEventListener('click', () => {
  somar(aberto, qtdDetalhe);
  fecharDetalhe();
});
raiz.querySelector('.detalheFechar').addEventListener('click', fecharDetalhe);
personalizar.addEventListener('click', fecharDetalhe);
detalhe.addEventListener('click', (evento) => { if (evento.target === detalhe) fecharDetalhe(); });

filtrar();
