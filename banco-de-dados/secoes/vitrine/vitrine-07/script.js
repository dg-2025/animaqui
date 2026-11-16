const carta = raiz.querySelector('.carta');
const email = raiz.querySelector('.email');
const aviso = raiz.querySelector('.cartaAviso');
const valido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

carta.addEventListener('submit', (evento) => {
  evento.preventDefault();
  aviso.classList.remove('certo', 'errado');
  if (!valido.test(email.value.trim())) {
    email.setAttribute('aria-invalid', 'true');
    aviso.textContent = 'Confira o e-mail: parece que falta alguma coisa.';
    aviso.classList.add('errado');
    email.focus();
    return;
  }
  email.removeAttribute('aria-invalid');
  aviso.textContent = 'Pronto, você está na lista. A próxima carta chega no seu e-mail.';
  aviso.classList.add('certo');
  email.value = '';
});
