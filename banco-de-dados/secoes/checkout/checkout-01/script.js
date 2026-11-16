const formulario = raiz.querySelector('.formulario');
const passos = [...raiz.querySelectorAll('.passo')];
const etapas = [...raiz.querySelectorAll('.etapa')];
const avancar = raiz.querySelector('.avancar');
const voltar = raiz.querySelector('.voltar');
const erro = raiz.querySelector('.erro');
const abas = [...raiz.querySelectorAll('.aba')];
const sucesso = raiz.querySelector('.sucesso');
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const subtotal = 589.8;
const textosBotao = ['Continuar para entrega', 'Continuar para pagamento', 'Pagar'];
let atual = 0;

// Ids únicos: o mesmo bloco pode aparecer duas vezes na página
const sufixo = Math.random().toString(36).slice(2, 7);
raiz.querySelectorAll('[id]').forEach((elemento) => { elemento.id += '-' + sufixo; });
raiz.querySelectorAll('[aria-controls]').forEach((elemento) => elemento.setAttribute('aria-controls', elemento.getAttribute('aria-controls') + '-' + sufixo));
raiz.querySelectorAll('[aria-labelledby]').forEach((elemento) => elemento.setAttribute('aria-labelledby', elemento.getAttribute('aria-labelledby') + '-' + sufixo));

const campo = (nome) => formulario.elements[nome];

// Máscaras simples: CEP, cartão e validade
function mascara(entrada, formato) {
  entrada.addEventListener('input', () => { entrada.value = formato(entrada.value.replace(/\D/g, '')); });
}
mascara(campo('cep'), (d) => d.slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2'));
mascara(campo('cartao'), (d) => d.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '));
mascara(campo('validade'), (d) => d.slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2'));
mascara(campo('cvv'), (d) => d.slice(0, 4));

// CEP de exemplo preenche o endereço, como faria um serviço de CEP de verdade
const ceps = { '01310100': { rua: 'Avenida Paulista', bairro: 'Bela Vista', cidade: 'São Paulo / SP' } };
campo('cep').addEventListener('input', () => {
  const achado = ceps[campo('cep').value.replace(/\D/g, '')];
  if (!achado) return;
  campo('rua').value = achado.rua;
  campo('bairro').value = achado.bairro;
  campo('cidade').value = achado.cidade;
  campo('numero').focus();
});

function abaAtual() {
  return abas.find((aba) => aba.getAttribute('aria-selected') === 'true');
}

function atualizarResumo() {
  const frete = formulario.querySelector('input[name="frete"]:checked');
  const valorFrete = parseFloat(frete.value);
  const pix = atual === 2 && abaAtual() === abas[0];
  const desconto = pix ? subtotal * 0.05 : 0;
  raiz.querySelector('.freteNome').textContent = frete.dataset.nome;
  raiz.querySelector('.freteValor').textContent = valorFrete ? real.format(valorFrete) : 'Grátis';
  raiz.querySelector('.linhaPix').hidden = !pix;
  raiz.querySelector('.pixValor').textContent = '− ' + real.format(desconto);
  raiz.querySelector('.total').textContent = real.format(subtotal + valorFrete - desconto);
}

function irPara(indice) {
  atual = indice;
  passos.forEach((passo, i) => { passo.hidden = i !== indice; });
  etapas.forEach((etapa, i) => {
    etapa.classList.toggle('feita', i < indice);
    etapa.classList.toggle('atual', i === indice);
    if (i === indice) etapa.setAttribute('aria-current', 'step');
    else etapa.removeAttribute('aria-current');
  });
  avancar.textContent = textosBotao[indice];
  voltar.disabled = indice === 0;
  erro.textContent = '';
  atualizarResumo();
}

function validar() {
  if (atual === 0) {
    const faltando = ['cep', 'numero', 'rua', 'bairro', 'cidade'].find((nome) => !campo(nome).value.trim());
    if (campo('cep').value.replace(/\D/g, '').length !== 8) return { nome: 'cep', texto: 'Digite um CEP com 8 números.' };
    if (faltando) return { nome: faltando, texto: 'Preencha todos os campos do endereço.' };
  }
  if (atual === 2 && abaAtual() === abas[1]) {
    if (campo('cartao').value.replace(/\D/g, '').length < 16) return { nome: 'cartao', texto: 'Confira o número do cartão: são 16 dígitos.' };
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(campo('validade').value)) return { nome: 'validade', texto: 'Validade no formato MM/AA.' };
    if (campo('cvv').value.length < 3) return { nome: 'cvv', texto: 'O CVV tem 3 ou 4 números, no verso do cartão.' };
  }
  return null;
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  formulario.querySelectorAll('[aria-invalid]').forEach((entrada) => entrada.removeAttribute('aria-invalid'));
  const problema = validar();
  if (problema) {
    erro.textContent = problema.texto;
    campo(problema.nome).setAttribute('aria-invalid', 'true');
    campo(problema.nome).focus();
    return;
  }
  if (atual < 2) {
    irPara(atual + 1);
    passos[atual].querySelector('input, button').focus();
    return;
  }
  const forma = abaAtual().textContent;
  raiz.querySelector('.sucessoTexto').textContent = 'Pagamento por ' + forma + ', total de ' + raiz.querySelector('.total').textContent + '. A confirmação chega por e-mail.';
  formulario.hidden = true;
  raiz.querySelector('.etapas').hidden = true;
  sucesso.hidden = false;
  sucesso.focus();
});

voltar.addEventListener('click', () => {
  if (atual > 0) irPara(atual - 1);
});

formulario.addEventListener('change', (evento) => {
  if (evento.target.name === 'frete') atualizarResumo();
});

// Abas de pagamento com setas do teclado
abas.forEach((aba, indice) => {
  aba.addEventListener('click', () => {
    abas.forEach((outra) => {
      const ativa = outra === aba;
      outra.setAttribute('aria-selected', String(ativa));
      outra.tabIndex = ativa ? 0 : -1;
      document.getElementById(outra.getAttribute('aria-controls')).hidden = !ativa;
    });
    erro.textContent = '';
    atualizarResumo();
  });
  aba.addEventListener('keydown', (evento) => {
    if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return;
    const proxima = abas[(indice + (evento.key === 'ArrowRight' ? 1 : -1) + abas.length) % abas.length];
    proxima.click();
    proxima.focus();
  });
});

raiz.querySelector('.recomecar').addEventListener('click', () => {
  formulario.reset();
  formulario.hidden = false;
  raiz.querySelector('.etapas').hidden = false;
  sucesso.hidden = true;
  abas[0].click();
  irPara(0);
  campo('cep').focus();
});

irPara(0);
