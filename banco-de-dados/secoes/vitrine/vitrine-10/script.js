// Cartões de produto: favoritar e escolher o tamanho numa janela antes de pôr na sacola
const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const modal = raiz.querySelector('.modalTamanho');
const modalGrade = modal.querySelector('.modalGrade');
const modalConfirmar = modal.querySelector('.modalConfirmar');
let cardAberto = null;
let origemModal = null;
let tamanhoEscolhido = '';
let esperaModal;

function pulsar(elemento) {
  elemento.classList.remove('pulou');
  void elemento.offsetWidth;
  elemento.classList.add('pulou');
}

function alternarFavorito(botao) {
  const nome = botao.closest('.card').dataset.nome;
  const ligado = botao.getAttribute('aria-pressed') !== 'true';
  botao.setAttribute('aria-pressed', String(ligado));
  botao.setAttribute('aria-label', (ligado ? 'Tirar dos favoritos: ' : 'Favoritar ') + nome);
  pulsar(botao);
  return ligado;
}

function escolherTamanho(botao) {
  modalGrade.querySelectorAll('.tamanho').forEach((outro) => outro.setAttribute('aria-pressed', String(outro === botao)));
  tamanhoEscolhido = botao.textContent;
  modalConfirmar.disabled = false;
  modalConfirmar.textContent = 'Confirmar e adicionar · ' + tamanhoEscolhido;
}

function abrirTamanhos(card, origem) {
  const tamanhos = card.dataset.tamanhos.split(' ');
  const esgotados = card.dataset.esgotados.split(' ').filter(Boolean);
  cardAberto = card;
  origemModal = origem;
  tamanhoEscolhido = '';
  clearTimeout(esperaModal);
  modal.setAttribute('aria-label', 'Escolher tamanho de ' + card.dataset.nome);
  modal.querySelector('.modalFoto').src = card.querySelector('.foto img').src;
  modal.querySelector('.modalNome').textContent = card.dataset.nome;
  modal.querySelector('.modalPreco').textContent = real.format(Number(card.dataset.preco));
  modalGrade.replaceChildren(...tamanhos.map((tamanho) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'tamanho';
    botao.textContent = tamanho;
    botao.setAttribute('aria-pressed', 'false');
    if (esgotados.includes(tamanho)) {
      botao.disabled = true;
      botao.title = 'Esgotado';
      botao.setAttribute('aria-label', tamanho + ', esgotado');
    }
    return botao;
  }));
  modalConfirmar.classList.remove('feito');
  modalConfirmar.disabled = true;
  modalConfirmar.textContent = 'Confirmar e adicionar';
  // Tamanho único (boné, bolsa) já vem marcado
  const livres = modalGrade.querySelectorAll('.tamanho:not(:disabled)');
  if (livres.length === 1) escolherTamanho(livres[0]);
  if (typeof modal.showModal === 'function') modal.showModal();
  else modal.setAttribute('open', '');
}

function fecharModal() {
  clearTimeout(esperaModal);
  if (typeof modal.close === 'function' && modal.open) modal.close();
  else modal.removeAttribute('open');
}

// Depois de somar, o botão do cartão confirma por um instante
function confirmarNoCard(card) {
  card.querySelectorAll('.sacola, .acaoComprar').forEach((botao) => {
    const texto = botao.querySelector('span') || botao;
    const antes = texto.textContent;
    botao.classList.add('feito');
    texto.textContent = 'Adicionado!';
    setTimeout(() => {
      botao.classList.remove('feito');
      texto.textContent = antes;
    }, 1500);
  });
}

modalGrade.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.tamanho');
  if (botao && !botao.disabled) escolherTamanho(botao);
});

modalConfirmar.addEventListener('click', () => {
  if (!tamanhoEscolhido || !cardAberto) return;
  avisarLoja(1);
  confirmarNoCard(cardAberto);
  modalConfirmar.classList.add('feito');
  modalConfirmar.disabled = true;
  modalConfirmar.textContent = '✓ Adicionado · tamanho ' + tamanhoEscolhido;
  esperaModal = setTimeout(fecharModal, 1000);
});

modal.querySelector('.modalFechar').addEventListener('click', fecharModal);
modal.addEventListener('click', (evento) => { if (evento.target === modal) fecharModal(); });
modal.addEventListener('close', () => { if (origemModal && origemModal.isConnected) origemModal.focus(); });

raiz.addEventListener('click', (evento) => {
  const comprar = evento.target.closest('.acaoComprar, .sacola');
  if (comprar && raiz.contains(comprar)) abrirTamanhos(comprar.closest('.card'), comprar);
});

// Busca com filtros: termo, categoria, preço, tamanhos, ordem e páginas de 6 itens
const POR_PAGINA = 6;
const grade = raiz.querySelector('.grade');
const todos = [...grade.querySelectorAll('.card')];
todos.forEach((card, indice) => { card.dataset.ordem = String(indice); });
const entrada = raiz.querySelector('.entradaBusca');
const limparBusca = raiz.querySelector('.limparBusca');
const titulo = raiz.querySelector('.tituloPrincipal');
const numeros = raiz.querySelectorAll('.numeroResultados');
const painel = raiz.querySelector('.painelFiltros');
const fundo = raiz.querySelector('.fundoGaveta');
const abrir = raiz.querySelector('.abrirFiltros');
const qtdFiltros = raiz.querySelector('.qtdFiltros');
const categorias = [...raiz.querySelectorAll('.botaoCategoria')];
const tamanhosFiltro = [...raiz.querySelectorAll('.botaoTamanho')];
const slider = raiz.querySelector('.sliderPreco');
const tetoTexto = raiz.querySelector('.tetoTexto');
const ordenar = raiz.querySelector('.ordenar');
const vazio = raiz.querySelector('.vazio');
const vazioTitulo = raiz.querySelector('.vazioTitulo');
const paginacao = raiz.querySelector('.paginacao');
const paginas = raiz.querySelector('.paginas');
const paginaInfo = raiz.querySelector('.paginaInfo');
const estado = { termo: '', categoria: '', teto: 500, tamanhos: new Set(), ordem: 'recentes', pagina: 1 };

const normalizar = (texto) => texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function escreverTitulo() {
  const destaque = document.createElement('span');
  destaque.className = 'destaque';
  if (estado.categoria) {
    destaque.textContent = estado.categoria;
    titulo.replaceChildren('Categoria: ', destaque);
  } else if (estado.termo) {
    destaque.textContent = '"' + estado.termo + '"';
    titulo.replaceChildren('Resultados para: ', destaque);
  } else {
    destaque.textContent = 'Completo';
    titulo.replaceChildren('Catálogo ', destaque);
  }
}

function botaoPagina(rotulo, pagina, desativado, atual) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'pagina';
  botao.innerHTML = rotulo;
  botao.disabled = desativado;
  if (atual) botao.setAttribute('aria-current', 'page');
  botao.addEventListener('click', () => {
    estado.pagina = pagina;
    atualizar();
    raiz.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
  return botao;
}

function atualizar() {
  const termo = normalizar(estado.termo.trim());
  const achados = todos.filter((card) => {
    const texto = normalizar(card.dataset.nome + ' ' + card.dataset.categoria);
    const tamanhos = card.dataset.tamanhos.split(' ');
    return (!termo || texto.includes(termo))
      && (!estado.categoria || card.dataset.categoria === estado.categoria)
      && Number(card.dataset.preco) <= estado.teto
      && (estado.tamanhos.size === 0 || tamanhos.some((t) => estado.tamanhos.has(t)));
  });
  const comparar = {
    recentes: (a, b) => a.dataset.ordem - b.dataset.ordem,
    menor: (a, b) => a.dataset.preco - b.dataset.preco,
    maior: (a, b) => b.dataset.preco - a.dataset.preco,
    nome: (a, b) => a.dataset.nome.localeCompare(b.dataset.nome, 'pt-BR'),
  }[estado.ordem];
  achados.sort(comparar);
  todos.slice().sort(comparar).forEach((card) => grade.append(card));

  const total = achados.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  estado.pagina = Math.min(estado.pagina, totalPaginas);
  const desta = achados.slice((estado.pagina - 1) * POR_PAGINA, estado.pagina * POR_PAGINA);
  todos.forEach((card) => { card.hidden = !desta.includes(card); });

  numeros.forEach((numero) => { numero.textContent = String(total); });
  escreverTitulo();
  vazio.hidden = total > 0;
  grade.hidden = total === 0;
  vazioTitulo.textContent = estado.categoria && !termo
    ? 'Nenhum item em "' + estado.categoria + '" com esses filtros'
    : 'Não encontramos nada' + (estado.termo.trim() ? ' para "' + estado.termo.trim() + '"' : ' com esses filtros');
  paginacao.hidden = totalPaginas < 2;
  paginas.replaceChildren(
    botaoPagina('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span class="somenteLeitor">Página anterior</span>', estado.pagina - 1, estado.pagina === 1, false),
    ...Array.from({ length: totalPaginas }, (_, i) => botaoPagina(String(i + 1), i + 1, false, i + 1 === estado.pagina)),
    botaoPagina('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg><span class="somenteLeitor">Próxima página</span>', estado.pagina + 1, estado.pagina === totalPaginas, false),
  );
  paginaInfo.textContent = 'Página ' + estado.pagina + ' de ' + totalPaginas;

  const ativos = (estado.categoria ? 1 : 0) + (estado.teto < 500 ? 1 : 0) + estado.tamanhos.size;
  qtdFiltros.textContent = String(ativos);
  qtdFiltros.hidden = ativos === 0;
  limparBusca.hidden = !estado.termo;
}

function mudar(alteracao) {
  alteracao();
  estado.pagina = 1;
  atualizar();
}

entrada.addEventListener('input', () => mudar(() => { estado.termo = entrada.value; }));
raiz.querySelector('.buscaTopo').addEventListener('submit', (evento) => { evento.preventDefault(); entrada.blur(); });
limparBusca.addEventListener('click', () => {
  entrada.value = '';
  mudar(() => { estado.termo = ''; });
  entrada.focus();
});
raiz.querySelectorAll('.sugestao').forEach((botao) => botao.addEventListener('click', () => {
  entrada.value = botao.textContent;
  mudar(() => { estado.termo = botao.textContent; });
}));

categorias.forEach((botao) => botao.addEventListener('click', () => mudar(() => {
  estado.categoria = estado.categoria === botao.textContent ? '' : botao.textContent;
  categorias.forEach((outro) => outro.setAttribute('aria-pressed', String(outro.textContent === estado.categoria)));
})));

tamanhosFiltro.forEach((botao) => botao.addEventListener('click', () => mudar(() => {
  const ligado = !estado.tamanhos.has(botao.textContent);
  if (ligado) estado.tamanhos.add(botao.textContent);
  else estado.tamanhos.delete(botao.textContent);
  botao.setAttribute('aria-pressed', String(ligado));
})));

function pintarSlider() {
  const cheio = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.setProperty('--cheio', cheio + '%');
  tetoTexto.textContent = 'Até ' + real.format(Number(slider.value)).replace(',00', '');
}
slider.addEventListener('input', () => mudar(() => { estado.teto = Number(slider.value); pintarSlider(); }));
ordenar.addEventListener('change', () => mudar(() => { estado.ordem = ordenar.value; }));

function limparTudo() {
  entrada.value = '';
  slider.value = '500';
  ordenar.value = 'recentes';
  categorias.concat(tamanhosFiltro).forEach((botao) => botao.setAttribute('aria-pressed', 'false'));
  mudar(() => Object.assign(estado, { termo: '', categoria: '', teto: 500, tamanhos: new Set(), ordem: 'recentes' }));
  pintarSlider();
}
raiz.querySelector('.limpar').addEventListener('click', limparTudo);
raiz.querySelector('.limparTudo').addEventListener('click', limparTudo);

// Gaveta de filtros no celular
function gaveta(aberta) {
  painel.classList.toggle('aberta', aberta);
  fundo.hidden = !aberta;
  abrir.setAttribute('aria-expanded', String(aberta));
  if (aberta) painel.querySelector('button, input').focus();
  else abrir.focus();
}
abrir.addEventListener('click', () => gaveta(true));
fundo.addEventListener('click', () => gaveta(false));
raiz.querySelector('.fecharGaveta').addEventListener('click', () => gaveta(false));
raiz.querySelector('.aplicar').addEventListener('click', () => gaveta(false));
raiz.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && painel.classList.contains('aberta')) gaveta(false);
});

raiz.addEventListener('click', (evento) => {
  const favorito = evento.target.closest('.favoritar');
  if (favorito) alternarFavorito(favorito);
});

pintarSlider();
atualizar();
