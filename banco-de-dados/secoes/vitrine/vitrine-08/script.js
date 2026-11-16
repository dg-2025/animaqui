const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const campo = raiz.querySelector('.buscaCampo');
const limpar = raiz.querySelector('.buscaLimpar');
const chips = [...raiz.querySelectorAll('.chip')];
const cards = [...raiz.querySelectorAll('.card')];
const contagem = raiz.querySelector('.contagem');
const vazio = raiz.querySelector('.vazio');
const grade = raiz.querySelector('.grade');
let filtro = 'todos';

// Busca sem acento e sem diferença de maiúscula: "aneis" acha "Anéis"
const normalizar = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
cards.forEach((card) => {
  card.dataset.busca = normalizar(card.querySelector('.cardTitulo').textContent + ' ' + card.querySelector('.tag').textContent);
});

function filtrar() {
  const termo = normalizar(campo.value);
  let visiveis = 0;
  cards.forEach((card) => {
    const passa = (filtro === 'todos' || card.dataset.categoria === filtro) && (!termo || card.dataset.busca.includes(termo));
    card.hidden = !passa;
    if (passa) visiveis += 1;
  });
  limpar.hidden = !campo.value;
  contagem.textContent = visiveis === 1 ? '1 joia' : visiveis + ' joias';
  vazio.hidden = visiveis > 0;
  grade.hidden = visiveis === 0;
  if (!visiveis) {
    const chipAtivo = chips.find((chip) => chip.dataset.filtro === filtro);
    raiz.querySelector('.vazioTermo').textContent = campo.value.trim() || chipAtivo.textContent;
  }
}

campo.addEventListener('input', filtrar);

limpar.addEventListener('click', () => {
  campo.value = '';
  filtrar();
  campo.focus();
});

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    filtro = chip.dataset.filtro;
    chips.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === chip)));
    filtrar();
  });
});

raiz.querySelector('.vazioLimpar').addEventListener('click', () => {
  campo.value = '';
  chips[0].click();
});

// O botão do hero leva até a grade
raiz.querySelector('.heroBotao').addEventListener('click', () => {
  raiz.querySelector('.busca').scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'start' });
});

raiz.querySelectorAll('.favorito').forEach((botao) => {
  botao.addEventListener('click', () => {
    botao.setAttribute('aria-pressed', String(botao.getAttribute('aria-pressed') !== 'true'));
  });
});

// Pôr na sacola: avisa a loja e o botão vira um ✓ dourado por um instante
raiz.querySelectorAll('.somar').forEach((botao) => {
  let espera;
  botao.addEventListener('click', () => {
    avisarLoja(1);
    clearTimeout(espera);
    botao.classList.add('feito');
    espera = setTimeout(() => botao.classList.remove('feito'), 1400);
  });
});
