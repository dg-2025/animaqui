const controles = raiz.querySelectorAll('[data-etapa]');
const descricao = raiz.querySelector('.descricao');

function ativar(etapa) {
  controles.forEach((controle) => {
    const ligado = controle.dataset.etapa === etapa;
    controle.classList.toggle('ativo', ligado);
    if (controle.hasAttribute('aria-pressed')) controle.setAttribute('aria-pressed', String(ligado));
  });

  const botao = raiz.querySelector(`.botao[data-etapa="${etapa}"]`);
  if (descricao.textContent === botao.dataset.texto) return;
  descricao.textContent = botao.dataset.texto;

  descricao.classList.remove('trocando');
  void descricao.offsetWidth;
  descricao.classList.add('trocando');
}

controles.forEach((controle) => {
  controle.addEventListener('click', () => ativar(controle.dataset.etapa));
});
