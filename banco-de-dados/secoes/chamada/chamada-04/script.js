const cartao = raiz.querySelector('.cartao');
const fechar = raiz.querySelector('.fechar');
const reabrir = raiz.querySelector('.reabrir');
const formulario = raiz.querySelector('.formulario');
const campo = raiz.querySelector('.campo');
const erro = raiz.querySelector('.erro');
const sucesso = raiz.querySelector('.sucesso');
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// O aviso de erro só aparece depois de tentar enviar, e some ao corrigir
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const valor = campo.value.trim();
  if (!emailValido.test(valor)) {
    erro.textContent = valor ? 'Esse e-mail parece incompleto. Confira e tente de novo.' : 'Digite seu e-mail para receber as dicas.';
    campo.setAttribute('aria-invalid', 'true');
    campo.focus();
    return;
  }
  formulario.hidden = true;
  sucesso.hidden = false;
});

campo.addEventListener('input', () => {
  if (campo.getAttribute('aria-invalid') === 'true' && emailValido.test(campo.value.trim())) {
    campo.removeAttribute('aria-invalid');
    erro.textContent = '';
  }
});

fechar.addEventListener('click', () => {
  const esconder = () => {
    cartao.hidden = true;
    cartao.classList.remove('saindo');
    reabrir.hidden = false;
    reabrir.focus();
  };
  if (reduzir) return esconder();
  cartao.classList.add('saindo');
  cartao.addEventListener('transitionend', esconder, { once: true });
});

reabrir.addEventListener('click', () => {
  reabrir.hidden = true;
  cartao.hidden = false;
  fechar.focus();
});
