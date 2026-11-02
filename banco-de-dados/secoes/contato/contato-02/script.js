// Demonstração: não envia nada, só mostra o carregamento e a mensagem de sucesso.
const formulario = raiz.querySelector('.formulario');
const botao = raiz.querySelector('.enviar');
const sucesso = raiz.querySelector('.sucesso');

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  sucesso.hidden = true;
  botao.disabled = true;
  formulario.setAttribute('data-enviando', '');

  setTimeout(function () {
    botao.disabled = false;
    formulario.removeAttribute('data-enviando');
    formulario.reset();
    sucesso.hidden = false;
  }, 1800);
});
