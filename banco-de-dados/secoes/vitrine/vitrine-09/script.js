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

// Destaques: troca sozinho quando a barra enche, pausa com o mouse em cima e aceita arrastar
const moldura = raiz.querySelector('.moldura');
const slides = [...raiz.querySelectorAll('.slide')];
const indicadores = [...raiz.querySelectorAll('.indicador')];
const numeroAtual = raiz.querySelector('.numeroAtual');
let atual = 0;

function mostrar(indice) {
  atual = (indice + slides.length) % slides.length;
  slides.forEach((slide, n) => {
    const ativo = n === atual;
    slide.classList.toggle('ativo', ativo);
    if (ativo) slide.removeAttribute('aria-hidden');
    else slide.setAttribute('aria-hidden', 'true');
    slide.querySelectorAll('a').forEach((link) => { link.tabIndex = ativo ? 0 : -1; });
  });
  indicadores.forEach((botao, n) => {
    botao.classList.toggle('ativo', n === atual);
    if (n === atual) botao.setAttribute('aria-current', 'true');
    else botao.removeAttribute('aria-current');
  });
  numeroAtual.textContent = String(atual + 1);
}

indicadores.forEach((botao, n) => {
  botao.addEventListener('click', () => mostrar(n));
  botao.querySelector('.preenchimento').addEventListener('animationend', () => {
    if (botao.classList.contains('ativo')) mostrar(atual + 1);
  });
});
raiz.querySelector('.anterior').addEventListener('click', () => mostrar(atual - 1));
raiz.querySelector('.proximo').addEventListener('click', () => mostrar(atual + 1));

let inicioToque = null;
moldura.addEventListener('pointerdown', (evento) => { inicioToque = evento.clientX; });
moldura.addEventListener('pointerup', (evento) => {
  if (inicioToque === null) return;
  const distancia = evento.clientX - inicioToque;
  inicioToque = null;
  if (Math.abs(distancia) > 48) mostrar(atual + (distancia < 0 ? 1 : -1));
});
moldura.addEventListener('pointercancel', () => { inicioToque = null; });

// Grade de uma ou duas colunas no celular
const grade = raiz.querySelector('.grade');
const alternar = raiz.querySelector('.alternarGrade');
alternar.addEventListener('click', () => {
  const dupla = !grade.classList.contains('dupla');
  grade.classList.toggle('dupla', dupla);
  alternar.setAttribute('aria-pressed', String(dupla));
  alternar.setAttribute('aria-label', dupla ? 'Mostrar um produto por linha' : 'Mostrar dois produtos por linha');
});

// Categorias filtram a grade sem sair da página
const chips = [...raiz.querySelectorAll('.chip')];
const cards = [...raiz.querySelectorAll('.card')];
const vazio = raiz.querySelector('.vazio');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const filtro = chip.dataset.filtro;
    let visiveis = 0;
    chips.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === chip)));
    cards.forEach((card) => {
      const mostra = !filtro || card.dataset.categoria === filtro;
      card.hidden = !mostra;
      if (mostra) visiveis += 1;
    });
    vazio.hidden = visiveis > 0;
  });
});

raiz.addEventListener('click', (evento) => {
  const favorito = evento.target.closest('.favoritar');
  if (favorito) alternarFavorito(favorito);
});

mostrar(0);
