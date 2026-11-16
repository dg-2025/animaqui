const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const formulario = raiz.querySelector('.informacoes');
const fotos = [...raiz.querySelectorAll('.imagemPrincipal .foto')];
const miniaturas = [...raiz.querySelectorAll('.miniatura')];
const principal = raiz.querySelector('.imagemPrincipal');
const corNome = raiz.querySelector('.corNome');
const tamanhoNome = raiz.querySelector('.tamanhoNome');
const opcoes = raiz.querySelector('.opcoesTamanho');
const erroTamanho = raiz.querySelector('.erroTamanho');
const estoque = raiz.querySelector('.estoque');
const estoqueTexto = raiz.querySelector('.estoqueTexto');
const menos = raiz.querySelector('.menos');
const mais = raiz.querySelector('.mais');
const saidaQtd = raiz.querySelector('.qtd');
const adicionar = raiz.querySelector('.adicionar');
const adicionarTexto = raiz.querySelector('.adicionarTexto');
const irCarrinho = raiz.querySelector('.irCarrinho');
const favoritar = raiz.querySelector('.favoritar');
const totalEstoque = [...raiz.querySelectorAll('input[name="tamanho"]')].reduce((soma, entrada) => soma + Number(entrada.dataset.estoque), 0);
let fotoAtual = 0;
let quantidade = 1;
let espera;

// Foto, miniatura e cor andam juntas
function mostrarFoto(indice, deCor) {
  fotoAtual = (indice + fotos.length) % fotos.length;
  fotos.forEach((foto, n) => foto.classList.toggle('ativa', n === fotoAtual));
  miniaturas.forEach((mini, n) => {
    mini.classList.toggle('ativa', n === fotoAtual);
    mini.setAttribute('aria-pressed', String(n === fotoAtual));
  });
  if (!deCor) {
    const cor = formulario.querySelector('input[name="cor"][data-foto="' + fotoAtual + '"]');
    if (cor) { cor.checked = true; corNome.textContent = cor.value; }
  }
}
miniaturas.forEach((mini, n) => mini.addEventListener('click', () => mostrarFoto(n, false)));

let inicioToque = null;
principal.addEventListener('pointerdown', (evento) => { inicioToque = evento.clientX; });
principal.addEventListener('pointerup', (evento) => {
  if (inicioToque === null) return;
  const distancia = evento.clientX - inicioToque;
  inicioToque = null;
  if (Math.abs(distancia) > 48) mostrarFoto(fotoAtual + (distancia < 0 ? 1 : -1), false);
});

function tamanhoEscolhido() {
  return formulario.querySelector('input[name="tamanho"]:checked');
}

function estoqueAtual() {
  const escolhido = tamanhoEscolhido();
  return escolhido ? Number(escolhido.dataset.estoque) : totalEstoque;
}

function atualizar() {
  const escolhido = tamanhoEscolhido();
  const disponivel = estoqueAtual();
  quantidade = Math.max(1, Math.min(quantidade, disponivel || 1));
  saidaQtd.textContent = String(quantidade);
  menos.disabled = quantidade <= 1;
  mais.disabled = quantidade >= disponivel;
  tamanhoNome.textContent = escolhido ? escolhido.value : 'Selecione uma opção';
  estoque.classList.toggle('disponivel', disponivel > 0);
  estoque.classList.toggle('esgotado', disponivel <= 0);
  estoqueTexto.textContent = disponivel > 0
    ? disponivel + (disponivel === 1 ? ' unidade disponível' : ' unidades disponíveis') + (escolhido ? ' no tamanho ' + escolhido.value : '')
    : 'Esgotado' + (escolhido ? ' no tamanho ' + escolhido.value : '');
  if (!adicionar.classList.contains('feito')) adicionarTexto.textContent = 'Adicionar ao carrinho';
}

formulario.addEventListener('change', (evento) => {
  if (evento.target.name === 'cor') {
    corNome.textContent = evento.target.value;
    mostrarFoto(Number(evento.target.dataset.foto), true);
  }
  if (evento.target.name === 'tamanho') {
    quantidade = 1;
    erroTamanho.hidden = true;
    atualizar();
  }
});

menos.addEventListener('click', () => { quantidade -= 1; atualizar(); });
mais.addEventListener('click', () => { quantidade += 1; atualizar(); });

// Sem tamanho, o botão aponta para a grade em vez de comprar
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const escolhido = tamanhoEscolhido();
  if (!escolhido) {
    erroTamanho.hidden = false;
    opcoes.classList.remove('lembrar');
    void opcoes.offsetWidth;
    opcoes.classList.add('lembrar');
    formulario.querySelector('input[name="tamanho"]:not(:disabled)').focus();
    return;
  }
  clearTimeout(espera);
  avisarLoja(quantidade);
  adicionar.classList.add('feito');
  adicionar.disabled = true;
  adicionarTexto.textContent = '✓ Adicionado ao carrinho!';
  irCarrinho.hidden = false;
  espera = setTimeout(() => {
    adicionar.classList.remove('feito');
    adicionar.disabled = false;
    atualizar();
  }, 1800);
});

favoritar.addEventListener('click', () => {
  const ligado = favoritar.getAttribute('aria-pressed') !== 'true';
  favoritar.setAttribute('aria-pressed', String(ligado));
  favoritar.setAttribute('aria-label', ligado ? 'Tirar Moletom Canguru dos favoritos' : 'Favoritar Moletom Canguru');
  favoritar.classList.remove('pulou');
  void favoritar.offsetWidth;
  favoritar.classList.add('pulou');
});

raiz.querySelector('.guia').addEventListener('click', (evento) => evento.preventDefault());

atualizar();
