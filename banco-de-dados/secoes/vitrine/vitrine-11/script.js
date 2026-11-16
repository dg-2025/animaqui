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

// Lista de desejos: o coração tira o item, "Limpar lista" esvazia e dá para desfazer
const grade = raiz.querySelector('.grade');
const numero = raiz.querySelector('.numeroSalvos');
const limpar = raiz.querySelector('.botaoLimpar');
const vazio = raiz.querySelector('.vazio');
const desfazer = raiz.querySelector('.botaoDesfazer');
const aviso = raiz.querySelector('.aviso');
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let guardados = [];
let esperaAviso;

grade.querySelectorAll('.favoritar').forEach((botao) => {
  botao.setAttribute('aria-pressed', 'true');
  botao.setAttribute('aria-label', 'Tirar dos favoritos: ' + botao.closest('.card').dataset.nome);
});

function avisar(texto) {
  clearTimeout(esperaAviso);
  aviso.textContent = texto;
  aviso.classList.add('visivel');
  esperaAviso = setTimeout(() => aviso.classList.remove('visivel'), 2400);
}

function atualizar() {
  const total = grade.querySelectorAll('.card:not(.saindo)').length;
  numero.textContent = String(total);
  limpar.hidden = total === 0;
  vazio.hidden = total > 0;
  grade.hidden = total === 0;
  desfazer.hidden = guardados.length === 0;
}

function tirar(card) {
  card.classList.add('saindo');
  guardados = [{ card, depois: card.nextElementSibling }];
  atualizar();
  const sair = () => { card.remove(); atualizar(); };
  if (reduzir) sair();
  else card.addEventListener('transitionend', sair, { once: true });
  avisar(card.dataset.nome + ' saiu dos favoritos.');
}

raiz.addEventListener('click', (evento) => {
  const favorito = evento.target.closest('.favoritar');
  if (favorito) tirar(favorito.closest('.card'));
});

limpar.addEventListener('click', () => {
  const cards = [...grade.querySelectorAll('.card')];
  guardados = cards.map((card) => ({ card, depois: null }));
  cards.forEach((card) => card.remove());
  atualizar();
  avisar('Lista limpa.');
});

// Desfazer devolve o que saiu por último
desfazer.addEventListener('click', () => {
  guardados.forEach(({ card, depois }) => {
    card.classList.remove('saindo');
    if (depois && depois.isConnected) grade.insertBefore(card, depois);
    else grade.append(card);
  });
  guardados = [];
  atualizar();
  avisar('Favoritos de volta.');
});

atualizar();
