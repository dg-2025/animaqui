const formulario = raiz.querySelector('.cartao');
const grade = raiz.querySelector('.grade');
const comprar = raiz.querySelector('.comprar');
const texto = raiz.querySelector('.comprarTexto');
let espera;

function atualizar() {
  const aro = formulario.querySelector('input[name="aro"]:checked');
  comprar.classList.toggle('aguardando', !aro);
  texto.textContent = aro ? 'Pôr no carrinho · aro ' + aro.value : 'Escolha o aro';
}

formulario.addEventListener('change', atualizar);

// Sem aro, o botão chama atenção para a grade em vez de comprar
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const aro = formulario.querySelector('input[name="aro"]:checked');
  if (!aro) {
    grade.classList.remove('lembrar');
    void grade.offsetWidth;
    grade.classList.add('lembrar');
    formulario.querySelector('input[name="aro"]:not(:disabled)').focus();
    return;
  }
  clearTimeout(espera);
  comprar.classList.add('feito');
  texto.textContent = 'No carrinho · aro ' + aro.value;
  espera = setTimeout(() => {
    comprar.classList.remove('feito');
    atualizar();
  }, 1800);
});

atualizar();
