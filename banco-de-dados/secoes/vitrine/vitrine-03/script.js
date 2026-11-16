const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const temPonteiroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Inclinação leve que segue o mouse (só com mouse e sem movimento reduzido)
if (!reduzir && temPonteiroFino) {
  raiz.querySelectorAll('.cartao').forEach((cartao) => {
    cartao.addEventListener('pointermove', (evento) => {
      const caixa = cartao.getBoundingClientRect();
      const x = (evento.clientX - caixa.left) / caixa.width - 0.5;
      const y = (evento.clientY - caixa.top) / caixa.height - 0.5;
      cartao.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      cartao.style.setProperty('--rx', (y * -10).toFixed(2) + 'deg');
    });
    cartao.addEventListener('pointerleave', () => {
      cartao.style.setProperty('--rx', '0deg');
      cartao.style.setProperty('--ry', '0deg');
    });
  });
}

raiz.querySelectorAll('.comprar').forEach((botao) => {
  botao.addEventListener('click', () => {
    const ligado = botao.getAttribute('aria-pressed') !== 'true';
    botao.setAttribute('aria-pressed', String(ligado));
    botao.textContent = ligado ? 'Na sacola' : 'Comprar';
  });
});
