const busca = raiz.querySelector('.busca');
const codigo = raiz.querySelector('.codigo');
const aviso = raiz.querySelector('.buscaAviso');
const rota = raiz.querySelector('.mRota');
const valido = /^[A-Z0-9]{4}-\d{3}-\d{4}$/;

// Código no formato XXXX-000-0000: redesenha a rota; outro formato mostra o erro
busca.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const valor = codigo.value.trim().toUpperCase();
  codigo.value = valor;
  aviso.classList.remove('errado');
  if (!valido.test(valor)) {
    aviso.textContent = 'Código não encontrado. Ele tem o formato BR2K-884-1207 e está no e-mail de envio.';
    aviso.classList.add('errado');
    codigo.setAttribute('aria-invalid', 'true');
    codigo.focus();
    return;
  }
  codigo.removeAttribute('aria-invalid');
  aviso.textContent = 'Pedido ' + valor + ' atualizado.';
  rota.style.animation = 'none';
  void rota.getBoundingClientRect();
  rota.style.animation = '';
});
