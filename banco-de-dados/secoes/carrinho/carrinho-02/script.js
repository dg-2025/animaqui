const lista = raiz.querySelector('.itens');
const vazio = raiz.querySelector('.vazio');
const dica = raiz.querySelector('.dica');
const qtdTotal = raiz.querySelector('.qtdTotal');
const formulario = raiz.querySelector('.resumo');
const campo = raiz.querySelector('.cupomCampo');
const aviso = raiz.querySelector('.aviso');
const subtotal = raiz.querySelector('.subtotal');
const desconto = raiz.querySelector('.desconto');
const total = raiz.querySelector('.total');
const finalizar = raiz.querySelector('.finalizar');
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const cupons = { ALMA10: 0.1 };
let taxa = 0;

function atualizar() {
  const itens = lista.querySelectorAll('.item:not(.saindo)');
  let soma = 0;
  let pecas = 0;
  itens.forEach((item) => {
    const n = Number(item.querySelector('.numero').value);
    const valor = n * parseFloat(item.dataset.preco);
    item.querySelector('.preco').textContent = real.format(valor);
    soma += valor;
    pecas += n;
  });
  const abatido = soma * taxa;
  qtdTotal.textContent = String(pecas);
  subtotal.textContent = real.format(soma);
  desconto.textContent = abatido ? '− ' + real.format(abatido) : real.format(0);
  total.textContent = real.format(soma - abatido);
  vazio.hidden = itens.length > 0;
  dica.hidden = itens.length === 0;
  finalizar.hidden = itens.length === 0;
}

function remover(item) {
  item.classList.add('saindo');
  atualizar();
  if (reduzir) item.remove();
  else item.addEventListener('transitionend', () => item.remove(), { once: true });
}

lista.querySelectorAll('.item').forEach((item) => {
  const frente = item.querySelector('.frente');
  const numero = item.querySelector('.numero');
  const excluir = item.querySelector('.excluir');
  const largura = () => excluir.offsetWidth;

  item.querySelector('.mais').addEventListener('click', () => {
    numero.value = String(Math.min(10, Number(numero.value) + 1));
    atualizar();
  });
  item.querySelector('.menos').addEventListener('click', () => {
    const novo = Number(numero.value) - 1;
    if (novo === 0) return remover(item);
    numero.value = String(novo);
    atualizar();
  });
  excluir.addEventListener('click', () => remover(item));

  // Arrastar para a esquerda: passa da metade e a lixeira fica aberta
  let inicio = null;
  let base = 0;
  frente.addEventListener('pointerdown', (evento) => {
    if (evento.target.closest('button')) return;
    inicio = evento.clientX;
    base = item.classList.contains('aberto') ? -largura() : 0;
    frente.classList.add('arrastando');
    frente.setPointerCapture(evento.pointerId);
  });
  frente.addEventListener('pointermove', (evento) => {
    if (inicio === null) return;
    const x = Math.max(-largura(), Math.min(0, base + evento.clientX - inicio));
    frente.style.setProperty('--x', x + 'px');
  });
  function soltar(evento) {
    if (inicio === null) return;
    const x = base + evento.clientX - inicio;
    inicio = null;
    frente.classList.remove('arrastando');
    frente.style.removeProperty('--x');
    const abrir = x < -largura() / 2;
    lista.querySelectorAll('.item.aberto').forEach((outro) => {
      if (outro !== item) {
        outro.classList.remove('aberto');
        outro.querySelector('.excluir').tabIndex = -1;
      }
    });
    item.classList.toggle('aberto', abrir);
    excluir.tabIndex = abrir ? 0 : -1;
  }
  frente.addEventListener('pointerup', soltar);
  frente.addEventListener('pointercancel', soltar);
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
    aviso.textContent = codigo ? 'Cupom não encontrado.' : 'Digite um cupom.';
    aviso.classList.add('errado');
  }
  atualizar();
});

atualizar();
