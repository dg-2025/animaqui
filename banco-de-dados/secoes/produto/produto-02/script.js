const numero = raiz.querySelector('.numero');
const menos = raiz.querySelector('.menos');
const mais = raiz.querySelector('.mais');
const adicionar = raiz.querySelector('.adicionar');
const texto = raiz.querySelector('.adicionarTexto');
const preco = raiz.querySelector('.adicionarPreco');
const unitario = parseFloat(adicionar.dataset.preco);
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
let quantidade = 1;
let espera;

// O botão mostra o total da quantidade escolhida
function mudar(passo) {
  quantidade = Math.max(1, Math.min(10, quantidade + passo));
  numero.value = String(quantidade);
  menos.disabled = quantidade === 1;
  mais.disabled = quantidade === 10;
  preco.textContent = real.format(quantidade * unitario);
}

menos.addEventListener('click', () => mudar(-1));
mais.addEventListener('click', () => mudar(1));

// Confirmação curta no próprio botão, sem tirar a pessoa da página
adicionar.addEventListener('click', () => {
  clearTimeout(espera);
  adicionar.classList.add('feito');
  texto.textContent = quantidade === 1 ? 'Na sacola' : quantidade + ' na sacola';
  espera = setTimeout(() => {
    adicionar.classList.remove('feito');
    texto.textContent = 'Adicionar';
  }, 1800);
});

mudar(0);
