const lista = raiz.querySelector('.listaItens');
const vazio = raiz.querySelector('.vazio');
const totalItens = raiz.querySelector('.totalItens');
const badge = raiz.querySelector('.badgeItens');
const formulario = raiz.querySelector('.cartaoResumo');
const campo = raiz.querySelector('.campoCupom');
const aviso = raiz.querySelector('.avisoCupom');
const linhaDesconto = raiz.querySelector('.linhaDesconto');
const cupomAplicado = raiz.querySelector('.cupomAplicado');
const faltaFrete = raiz.querySelector('.faltaFrete');
const finalizar = raiz.querySelector('.finalizar');
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const FRETE_GRATIS = 299;
const FRETE = 24.9;
const cupons = { RUA10: 0.1, PRIMEIRA15: 0.15 };
let cupom = '';

// Ids únicos: o mesmo bloco pode aparecer duas vezes na página
const sufixo = Math.random().toString(36).slice(2, 7);
raiz.querySelectorAll('[id]').forEach((elemento) => { elemento.id += '-' + sufixo; });
raiz.querySelectorAll('label[for]').forEach((rotulo) => rotulo.setAttribute('for', rotulo.getAttribute('for') + '-' + sufixo));

function atualizar() {
  const itens = [...lista.querySelectorAll('.item:not(.saindo)')];
  let soma = 0;
  let pecas = 0;
  itens.forEach((item) => {
    const qtd = Number(item.querySelector('.qtd').textContent);
    const valor = qtd * parseFloat(item.dataset.preco);
    item.querySelector('.subtotalItem').textContent = real.format(valor);
    item.querySelector('.menos').disabled = qtd <= 1;
    item.querySelector('.mais').disabled = qtd >= 10;
    soma += valor;
    pecas += qtd;
  });
  const desconto = cupom ? soma * cupons[cupom] : 0;
  const base = soma - desconto;
  const frete = base >= FRETE_GRATIS || base === 0 ? 0 : FRETE;
  totalItens.textContent = String(pecas);
  raiz.querySelector('.subtotal').textContent = real.format(soma);
  linhaDesconto.hidden = !cupom;
  cupomAplicado.textContent = cupom ? '(' + cupom + ')' : '';
  raiz.querySelector('.desconto').textContent = '− ' + real.format(desconto);
  const campoFrete = raiz.querySelector('.frete');
  campoFrete.textContent = frete ? real.format(frete) : 'Grátis';
  campoFrete.classList.toggle('textoVerde', !frete);
  faltaFrete.hidden = !frete;
  faltaFrete.textContent = 'Faltam ' + real.format(FRETE_GRATIS - base) + ' para o frete grátis.';
  raiz.querySelector('.total').textContent = real.format(base + frete);
  lista.hidden = itens.length === 0;
  vazio.hidden = itens.length > 0;
  finalizar.setAttribute('aria-disabled', String(itens.length === 0));
  badge.classList.remove('pulou');
  void badge.offsetWidth;
  badge.classList.add('pulou');
}

function remover(item) {
  item.classList.add('saindo');
  atualizar();
  if (reduzir) item.remove();
  else item.addEventListener('transitionend', () => item.remove(), { once: true });
}

lista.addEventListener('click', (evento) => {
  const item = evento.target.closest('.item');
  if (!item) return;
  const qtd = item.querySelector('.qtd');
  if (evento.target.closest('.mais')) qtd.textContent = String(Math.min(10, Number(qtd.textContent) + 1));
  else if (evento.target.closest('.menos')) qtd.textContent = String(Math.max(1, Number(qtd.textContent) - 1));
  else if (evento.target.closest('.removerCelular, .removerComputador')) return remover(item);
  else return;
  atualizar();
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const codigo = campo.value.trim().toUpperCase();
  aviso.classList.remove('certo', 'errado');
  if (cupons[codigo]) {
    cupom = codigo;
    aviso.textContent = 'Cupom ' + codigo + ' aplicado: ' + Math.round(cupons[codigo] * 100) + '% de desconto.';
    aviso.classList.add('certo');
  } else {
    cupom = '';
    aviso.textContent = codigo ? 'Cupom "' + codigo + '" não encontrado.' : 'Digite um cupom.';
    aviso.classList.add('errado');
  }
  atualizar();
});

atualizar();
