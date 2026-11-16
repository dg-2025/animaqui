const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const SUBTOTAL = 739.6;
const [caixaEndereco, caixaPagamento] = raiz.querySelectorAll('.caixa');
const formEndereco = raiz.querySelector('.formEndereco');
const formPagamento = raiz.querySelector('.formPagamento');
const resumoEtapa = raiz.querySelector('.resumoEtapa');
const parcelas = raiz.querySelector('.parcelas');
const detalhesCartao = raiz.querySelector('.detalhesCartao');
const detalhesPix = raiz.querySelector('.detalhesPix');
const grade = raiz.querySelector('.grade');
const sucesso = raiz.querySelector('.sucesso');
const finalizar = raiz.querySelector('.botaoFinalizar');

// Ids únicos: o mesmo bloco pode aparecer duas vezes na página
const sufixo = Math.random().toString(36).slice(2, 7);
raiz.querySelectorAll('[id]').forEach((elemento) => { elemento.id += '-' + sufixo; });
raiz.querySelectorAll('[aria-labelledby]').forEach((elemento) => elemento.setAttribute('aria-labelledby', elemento.getAttribute('aria-labelledby') + '-' + sufixo));

const campoE = (nome) => formEndereco.elements[nome];
const campoP = (nome) => formPagamento.elements[nome];

function mascara(entrada, formato) {
  entrada.addEventListener('input', () => { entrada.value = formato(entrada.value.replace(/\D/g, '')); });
}
mascara(campoE('cep'), (d) => d.slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2'));
mascara(campoP('cartao'), (d) => d.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '));
mascara(campoP('validade'), (d) => d.slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2'));
mascara(campoP('cvv'), (d) => d.slice(0, 4));

// CEP de exemplo preenche o endereço, como um serviço de CEP faria
const ceps = { '01310100': { rua: 'Avenida Paulista', bairro: 'Bela Vista', cidade: 'São Paulo', estado: 'SP' } };
campoE('cep').addEventListener('input', () => {
  const achado = ceps[campoE('cep').value.replace(/\D/g, '')];
  if (!achado) return;
  Object.keys(achado).forEach((nome) => { campoE(nome).value = achado[nome]; });
  campoE('numero').focus();
});

function total() {
  const pix = formPagamento.elements.forma.value === 'pix';
  return { pix, valor: pix ? SUBTOTAL * 0.95 : SUBTOTAL, desconto: pix ? SUBTOTAL * 0.05 : 0 };
}

function atualizarTotais() {
  const conta = total();
  raiz.querySelector('.valorTotal').textContent = real.format(conta.valor);
  raiz.querySelector('.totalBotao').textContent = real.format(conta.valor);
  raiz.querySelector('.linhaPix').hidden = !conta.pix;
  raiz.querySelector('.valorPix').textContent = '− ' + real.format(conta.desconto);
  detalhesCartao.hidden = conta.pix;
  detalhesPix.hidden = !conta.pix;
  parcelas.replaceChildren(...[1, 2, 3, 4, 5, 6].map((n) => new Option(n + 'x de ' + real.format(SUBTOTAL / n) + ' sem juros', String(n))));
}

function mostrarErro(formulario, nome, texto) {
  formulario.querySelector('.erro').textContent = texto;
  formulario.elements[nome].setAttribute('aria-invalid', 'true');
  formulario.elements[nome].focus();
}

function limparErros(formulario) {
  formulario.querySelector('.erro').textContent = '';
  formulario.querySelectorAll('[aria-invalid]').forEach((entrada) => entrada.removeAttribute('aria-invalid'));
}

function irPara(etapa) {
  const naEntrega = etapa === 1;
  caixaEndereco.classList.toggle('ativa', naEntrega);
  caixaEndereco.classList.toggle('feita', !naEntrega);
  caixaPagamento.classList.toggle('ativa', !naEntrega);
  formEndereco.hidden = !naEntrega;
  resumoEtapa.hidden = naEntrega;
  formPagamento.hidden = naEntrega;
}

formEndereco.addEventListener('submit', (evento) => {
  evento.preventDefault();
  limparErros(formEndereco);
  if (campoE('cep').value.replace(/\D/g, '').length !== 8) return mostrarErro(formEndereco, 'cep', 'Digite um CEP com 8 números.');
  const faltando = ['rua', 'numero', 'bairro', 'cidade'].find((nome) => !campoE(nome).value.trim());
  if (faltando) return mostrarErro(formEndereco, faltando, 'Preencha todos os campos do endereço.');
  raiz.querySelector('.enderecoTexto').textContent = campoE('rua').value + ', ' + campoE('numero').value + ' - ' + campoE('bairro').value + ', ' + campoE('cidade').value + '/' + campoE('estado').value;
  irPara(2);
  formPagamento.querySelector('input').focus();
});

raiz.querySelector('.alterar').addEventListener('click', () => {
  irPara(1);
  campoE('rua').focus();
});

formPagamento.addEventListener('change', (evento) => {
  if (evento.target.name === 'forma') {
    limparErros(formPagamento);
    atualizarTotais();
  }
});

formPagamento.addEventListener('submit', (evento) => {
  evento.preventDefault();
  limparErros(formPagamento);
  if (!total().pix) {
    if (campoP('cartao').value.replace(/\D/g, '').length < 16) return mostrarErro(formPagamento, 'cartao', 'Confira o número do cartão: são 16 dígitos.');
    if (!campoP('nome').value.trim()) return mostrarErro(formPagamento, 'nome', 'Digite o nome como está no cartão.');
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(campoP('validade').value)) return mostrarErro(formPagamento, 'validade', 'Validade no formato MM/AA.');
    if (campoP('cvv').value.length < 3) return mostrarErro(formPagamento, 'cvv', 'O CVV tem 3 ou 4 números, no verso do cartão.');
  }
  // Processando por um instante, como um pagamento de verdade
  finalizar.disabled = true;
  finalizar.textContent = 'Processando...';
  setTimeout(() => {
    const conta = total();
    raiz.querySelector('.numeroPedido').textContent = 'Pedido #TM-' + String(48200 + Math.floor(Math.random() * 800));
    raiz.querySelector('.sucessoTexto').textContent = 'Obrigado pela compra! Pagamento por ' + (conta.pix ? 'Pix' : 'cartão') + ', total de ' + real.format(conta.valor) + '. O andamento chega no seu e-mail.';
    grade.hidden = true;
    sucesso.hidden = false;
    sucesso.focus();
  }, 900);
});

raiz.querySelector('.recomecar').addEventListener('click', () => {
  formEndereco.reset();
  formPagamento.reset();
  finalizar.disabled = false;
  finalizar.innerHTML = 'Finalizar compra · <span class="totalBotao"></span>';
  grade.hidden = false;
  sucesso.hidden = true;
  caixaEndereco.classList.remove('feita');
  irPara(1);
  atualizarTotais();
  campoE('cep').focus();
});

atualizarTotais();
irPara(1);
