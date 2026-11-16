const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const freteGratis = 3000;
const cupons = { OURO10: 0.1 };
const formCupom = raiz.querySelector('.cupom');
const campoCupom = raiz.querySelector('.cupomCampo');
const avisoCupom = raiz.querySelector('.cupomAviso');
let cupom = null;

// Ids únicos: o mesmo bloco pode aparecer duas vezes na página
const sufixo = Math.random().toString(36).slice(2, 7);
raiz.querySelectorAll('[id]').forEach((elemento) => { elemento.id += '-' + sufixo; });
raiz.querySelectorAll('label[for]').forEach((rotulo) => { rotulo.htmlFor += '-' + sufixo; });

const itens = () => [...raiz.querySelectorAll('.item:not(.saindo)')];

// Recalcula contagem, subtotal, cupom, total e a barra do frete grátis
function atualizar() {
  let quantidade = 0;
  let subtotal = 0;
  itens().forEach((item) => {
    const qtd = Number(item.querySelector('.numero').textContent);
    quantidade += qtd;
    subtotal += qtd * Number(item.dataset.preco);
    item.querySelector('.menos').disabled = qtd <= 1;
    item.querySelector('.mais').disabled = qtd >= Number(item.dataset.estoque);
  });
  const desconto = cupom ? subtotal * cupons[cupom] : 0;
  const total = subtotal - desconto;
  raiz.querySelector('.tituloContagem').textContent = '(' + quantidade + ')';
  raiz.querySelector('.totalItens').textContent = String(quantidade);
  raiz.querySelector('.subtotal').textContent = real.format(subtotal);
  raiz.querySelector('.linhaDesconto').hidden = !cupom;
  raiz.querySelector('.cupomNome').textContent = cupom || '';
  raiz.querySelector('.desconto').textContent = '− ' + real.format(desconto);
  raiz.querySelector('.total').textContent = real.format(total);

  const frete = raiz.querySelector('.frete');
  const falta = Math.max(0, freteGratis - total);
  frete.classList.toggle('liberado', falta === 0);
  raiz.querySelector('.freteTexto').innerHTML = falta === 0
    ? '<strong>Frete segurado grátis</strong> liberado para esta sacola'
    : 'Faltam <strong>' + real.format(falta) + '</strong> para o frete segurado grátis';
  raiz.querySelector('.freteProgresso').style.width = Math.min(100, (total / freteGratis) * 100) + '%';

  const vazia = quantidade === 0;
  raiz.querySelector('.corpo').hidden = vazia;
  raiz.querySelector('.vazio').hidden = !vazia;
}

raiz.querySelectorAll('.item').forEach((item) => {
  const numero = item.querySelector('.numero');
  item.querySelector('.menos').addEventListener('click', () => {
    numero.textContent = String(Math.max(1, Number(numero.textContent) - 1));
    atualizar();
  });
  item.querySelector('.mais').addEventListener('click', () => {
    numero.textContent = String(Math.min(Number(item.dataset.estoque), Number(numero.textContent) + 1));
    atualizar();
  });
  // Remover: o item desliza para fora antes de sair da lista
  item.querySelector('.remover').addEventListener('click', () => {
    item.classList.add('saindo');
    atualizar();
    setTimeout(() => item.remove(), reduzir ? 0 : 300);
  });
});

formCupom.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const codigo = campoCupom.value.trim().toUpperCase();
  campoCupom.removeAttribute('aria-invalid');
  if (!codigo) return;
  if (!cupons[codigo]) {
    void campoCupom.offsetWidth;
    campoCupom.setAttribute('aria-invalid', 'true');
    avisoCupom.className = 'cupomAviso erro';
    avisoCupom.textContent = 'Cupom não encontrado. Teste com OURO10.';
    return;
  }
  cupom = codigo;
  avisoCupom.className = 'cupomAviso ok';
  avisoCupom.textContent = 'Cupom ' + codigo + ' aplicado: ' + (cupons[codigo] * 100) + '% de desconto.';
  atualizar();
});

atualizar();
