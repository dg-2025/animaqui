const chips = raiz.querySelectorAll('.chip');
const joias = raiz.querySelectorAll('.joia');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const filtro = chip.dataset.filtro;
    chips.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === chip)));
    joias.forEach((joia) => {
      joia.hidden = filtro !== 'todos' && joia.dataset.tipo !== filtro;
    });
  });
});

raiz.querySelectorAll('.favorito').forEach((botao) => {
  botao.addEventListener('click', () => {
    botao.setAttribute('aria-pressed', String(botao.getAttribute('aria-pressed') !== 'true'));
  });
});
