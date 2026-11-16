const formulario = raiz.querySelector('.formulario');
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const endereco = raiz.querySelector('.endereco');
const retirada = raiz.querySelector('.retirada');
const troco = raiz.querySelector('.troco');
const dicaPix = raiz.querySelector('.dicaPix');
const taxa = raiz.querySelector('.taxa');
const total = raiz.querySelector('.total');
const erro = raiz.querySelector('.erro');
const resumo = raiz.querySelector('.resumo');
const sucesso = raiz.querySelector('.sucesso');
const subtotal = 158.4;

// Ids únicos: o mesmo bloco pode aparecer duas vezes na página
const sufixo = Math.random().toString(36).slice(2, 7);
raiz.querySelectorAll('[id]').forEach((elemento) => { elemento.id += '-' + sufixo; });
raiz.querySelectorAll('[aria-controls]').forEach((elemento) => elemento.setAttribute('aria-controls', elemento.getAttribute('aria-controls') + '-' + sufixo));

const campo = (nome) => formulario.elements[nome];

// WhatsApp com máscara (00) 00000-0000
campo('telefone').addEventListener('input', () => {
  const d = campo('telefone').value.replace(/\D/g, '').slice(0, 11);
  campo('telefone').value = d.length > 6
    ? '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7)
    : d.length > 2 ? '(' + d.slice(0, 2) + ') ' + d.slice(2) : d;
});

function atualizar() {
  const entrega = campo('modo').value === 'entrega';
  const pagamento = campo('pagamento').value;
  const valorTaxa = entrega ? parseFloat(campo('bairro').value) || 0 : 0;

  endereco.hidden = !entrega;
  endereco.disabled = !entrega;
  retirada.hidden = entrega;
  troco.hidden = pagamento !== 'Dinheiro';
  dicaPix.hidden = pagamento !== 'Pix';

  taxa.classList.toggle('gratis', !entrega);
  taxa.classList.toggle('pendente', entrega && !campo('bairro').value);
  if (!entrega) taxa.textContent = 'Grátis';
  else taxa.textContent = campo('bairro').value ? real.format(valorTaxa) : 'escolha o bairro';

  const novo = real.format(subtotal + valorTaxa);
  if (total.textContent !== novo) {
    total.textContent = novo;
    total.classList.remove('mudou');
    void total.offsetWidth;
    total.classList.add('mudou');
  }
}

formulario.addEventListener('change', atualizar);
formulario.addEventListener('input', (evento) => {
  if (evento.target.getAttribute('aria-invalid') === 'true' && evento.target.value.trim()) evento.target.removeAttribute('aria-invalid');
});

// Confere os campos obrigatórios que estão à vista e mostra a confirmação
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const obrigatorios = [...formulario.querySelectorAll('[required]')].filter((elemento) => !elemento.closest('[hidden]') && !elemento.disabled);
  const vazios = obrigatorios.filter((elemento) => !elemento.value.trim());
  obrigatorios.forEach((elemento) => {
    if (vazios.includes(elemento)) elemento.setAttribute('aria-invalid', 'true');
    else elemento.removeAttribute('aria-invalid');
  });
  const telefoneCurto = campo('telefone').value.replace(/\D/g, '').length < 10;
  if (vazios.length || telefoneCurto) {
    if (telefoneCurto) campo('telefone').setAttribute('aria-invalid', 'true');
    erro.textContent = vazios.length ? 'Preencha os campos marcados para continuar.' : 'Confira o WhatsApp com DDD.';
    erro.hidden = false;
    (vazios[0] || campo('telefone')).focus();
    return;
  }
  erro.hidden = true;
  raiz.querySelector('.numero').textContent = '#' + (2200 + Math.floor(Math.random() * 90));
  raiz.querySelector('.sucessoTexto').textContent = campo('modo').value === 'entrega'
    ? 'Chega em 30 a 45 minutos. Pagamento: ' + campo('pagamento').value + '.'
    : 'Fica pronto em cerca de 20 minutos. Pagamento: ' + campo('pagamento').value + '.';
  resumo.hidden = true;
  sucesso.hidden = false;
});

atualizar();
