const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const chips = raiz.querySelectorAll('.chip');
const produtos = raiz.querySelectorAll('.produto');
const vazio = raiz.querySelector('.vazio');
const sacola = raiz.querySelector('.sacola');
const contagem = raiz.querySelector('.contagem');

// Categoria: mostra só as peças dela; sem peças, aparece o aviso
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const filtro = chip.dataset.filtro;
    let visiveis = 0;
    chips.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === chip)));
    produtos.forEach((produto) => {
      produto.hidden = filtro !== 'todos' && produto.dataset.genero !== filtro;
      if (!produto.hidden) visiveis += 1;
    });
    vazio.hidden = visiveis > 0;
  });
});

raiz.querySelectorAll('.favorito').forEach((botao) => {
  botao.addEventListener('click', () => {
    botao.setAttribute('aria-pressed', String(botao.getAttribute('aria-pressed') !== 'true'));
  });
});

// Sacola: cada botão liga e desliga a peça, e o número do topo acompanha
function contar() {
  const total = raiz.querySelectorAll('.levar[aria-pressed="true"]').length;
  contagem.textContent = String(total);
  contagem.hidden = total === 0;
  sacola.setAttribute('aria-label', total === 0 ? 'Sacola vazia' : 'Sacola com ' + total + (total === 1 ? ' item' : ' itens'));
  contagem.classList.remove('pulou');
  void contagem.offsetWidth;
  contagem.classList.add('pulou');
}

raiz.querySelectorAll('.levar').forEach((botao) => {
  botao.addEventListener('click', () => {
    const ligado = botao.getAttribute('aria-pressed') !== 'true';
    botao.setAttribute('aria-pressed', String(ligado));
    avisarLoja(ligado ? 1 : -1);
    contar();
  });
});
