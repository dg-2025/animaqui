const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formulario = raiz.querySelector('.formulario');
const blocos = [...raiz.querySelectorAll('.bloco')];
const etapas = [...raiz.querySelectorAll('.etapa')];
const erro = raiz.querySelector('.erro');
const confirmar = raiz.querySelector('.confirmar');
const sucesso = raiz.querySelector('.sucesso');
const mensagem = raiz.querySelector('.mensagem');
const parcelas = raiz.querySelector('.parcelas');
const seletorParcelas = parcelas.querySelector('select');
const subtotal = 2557.9;
const embalagem = 15;
const mexidos = new Set();
const campo = (nome) => formulario.elements[nome];
const digitos = (nome) => campo(nome).value.replace(/\D/g, '');

// Máscaras: CPF, WhatsApp e CEP
function mascara(nome, formato) {
  campo(nome).addEventListener('input', () => { campo(nome).value = formato(digitos(nome)); });
}
mascara('cpf', (d) => d.slice(0, 11).replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1-$2'));
mascara('whatsapp', (d) => d.slice(0, 11).replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2'));
mascara('cep', (d) => d.slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2'));

// CEP de exemplo preenche o endereço, como faria um serviço de CEP de verdade
const ceps = { '01310100': 'Avenida Paulista, Bela Vista, São Paulo - SP' };
campo('cep').addEventListener('input', () => {
  const achado = ceps[digitos('cep')];
  if (!achado) return;
  campo('endereco').value = achado;
  campo('numero').focus();
});

function problemaIdentificacao() {
  if (campo('nome').value.trim().split(/\s+/).length < 2) return { nome: 'nome', texto: 'Digite o nome e o sobrenome.' };
  if (digitos('cpf').length !== 11) return { nome: 'cpf', texto: 'O CPF tem 11 números.' };
  if (digitos('whatsapp').length < 10) return { nome: 'whatsapp', texto: 'Confira o WhatsApp com DDD.' };
  if (digitos('cep').length !== 8) return { nome: 'cep', texto: 'Digite um CEP com 8 números.' };
  if (!campo('numero').value.trim()) return { nome: 'numero', texto: 'Falta o número do endereço.' };
  if (campo('endereco').value.trim().length < 8) return { nome: 'endereco', texto: 'Preencha o endereço completo.' };
  return null;
}

function contas() {
  const entrega = formulario.querySelector('input[name="entrega"]:checked');
  const valorEntrega = parseFloat(entrega.value);
  const presente = campo('presente').checked ? embalagem : 0;
  const pix = formulario.querySelector('input[name="pagamento"]:checked').value === 'pix';
  const base = subtotal + valorEntrega + presente;
  const desconto = pix ? subtotal * 0.05 : 0;
  return { entrega, valorEntrega, presente, pix, desconto, total: base - desconto };
}

// Recalcula o resumo e acende as etapas já preenchidas
function atualizar() {
  const c = contas();
  raiz.querySelector('.entregaNome').textContent = c.entrega.dataset.nome;
  raiz.querySelector('.entregaValor').textContent = c.valorEntrega ? real.format(c.valorEntrega) : 'Grátis';
  raiz.querySelector('.linhaPresente').hidden = !c.presente;
  raiz.querySelector('.linhaPix').hidden = !c.pix;
  raiz.querySelector('.pixValor').textContent = '− ' + real.format(c.desconto);
  raiz.querySelector('.total').textContent = real.format(c.total);
  mensagem.hidden = !c.presente;
  parcelas.hidden = c.pix;

  const escolhida = seletorParcelas.value || '1';
  seletorParcelas.innerHTML = '';
  for (let vezes = 1; vezes <= 10; vezes += 1) {
    seletorParcelas.add(new Option(vezes + 'x de ' + real.format(c.total / vezes) + ' sem juros', String(vezes)));
  }
  seletorParcelas.value = escolhida;

  const feitas = [!problemaIdentificacao(), mexidos.has(1) && !problemaIdentificacao(), mexidos.has(2) && !problemaIdentificacao()];
  const atual = feitas.indexOf(false);
  etapas.forEach((etapa, i) => {
    etapa.classList.toggle('feita', feitas[i]);
    etapa.classList.toggle('atual', i === atual);
  });
  blocos.forEach((bloco, i) => bloco.classList.toggle('completo', feitas[i]));
}

blocos.forEach((bloco, i) => {
  bloco.addEventListener('change', () => { mexidos.add(i); atualizar(); });
});
formulario.addEventListener('input', (evento) => {
  evento.target.removeAttribute('aria-invalid');
  erro.textContent = '';
  atualizar();
});

const restantes = raiz.querySelector('.restantes');
campo('mensagem').addEventListener('input', () => { restantes.textContent = String(140 - campo('mensagem').value.length); });

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const problema = problemaIdentificacao();
  if (problema) {
    erro.textContent = problema.texto;
    campo(problema.nome).setAttribute('aria-invalid', 'true');
    campo(problema.nome).focus({ preventScroll: true });
    campo(problema.nome).scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'center' });
    return;
  }
  const c = contas();
  const forma = c.pix ? 'Pix' : 'cartão em ' + seletorParcelas.value + 'x';
  confirmar.classList.add('enviando');
  confirmar.textContent = 'Confirmando...';
  setTimeout(() => {
    const numero = 2400 + Math.floor(Math.random() * 99);
    raiz.querySelector('.sucessoTexto').textContent = 'Pedido #' + numero + ' no ' + forma + ', total de ' + real.format(c.total) + '. A confirmação chega por e-mail e WhatsApp.';
    formulario.hidden = true;
    raiz.querySelector('.etapas').hidden = true;
    sucesso.hidden = false;
    sucesso.focus();
    confirmar.classList.remove('enviando');
    confirmar.textContent = 'Confirmar pedido';
  }, reduzir ? 0 : 900);
});

atualizar();
