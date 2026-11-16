const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const formulario = raiz.querySelector('.info');
const comprar = raiz.querySelector('.comprar');
const texto = raiz.querySelector('.comprarTexto');
const preco = raiz.querySelector('.comprarPreco');
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
let espera;

// Assinatura ou compra única: o botão mostra o preço da escolha
function atualizar() {
  const plano = formulario.querySelector('input[name="plano"]:checked');
  texto.textContent = 'Adicionar · ' + plano.dataset.texto;
  preco.textContent = real.format(parseFloat(plano.dataset.preco));
}

formulario.addEventListener('change', atualizar);
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  clearTimeout(espera);
  avisarLoja(1);
  comprar.classList.add('feito');
  texto.textContent = 'Adicionado ao carrinho';
  espera = setTimeout(() => {
    comprar.classList.remove('feito');
    atualizar();
  }, 1800);
});

atualizar();
