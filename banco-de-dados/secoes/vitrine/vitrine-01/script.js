const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const abas = raiz.querySelectorAll('.aba');
const contagem = raiz.querySelector('.contagem');
const sacola = raiz.querySelector('.sacola');
let naSacola = Number(contagem.textContent);

abas.forEach((aba) => {
  aba.addEventListener('click', (evento) => {
    evento.preventDefault();
    abas.forEach((outra) => outra.removeAttribute('aria-current'));
    aba.setAttribute('aria-current', 'page');
  });
});

raiz.querySelectorAll('.favorito').forEach((botao) => {
  botao.addEventListener('click', () => {
    botao.setAttribute('aria-pressed', String(botao.getAttribute('aria-pressed') !== 'true'));
  });
});

// Cor escolhida: só uma marcada por produto
raiz.querySelectorAll('.cores').forEach((grupo) => {
  const cores = grupo.querySelectorAll('.cor');
  cores.forEach((cor) => {
    cor.addEventListener('click', () => {
      cores.forEach((outra) => outra.setAttribute('aria-pressed', String(outra === cor)));
    });
  });
});

// O + soma na sacola do topo e confirma no próprio botão
raiz.querySelectorAll('.somar').forEach((botao) => {
  let espera;
  botao.addEventListener('click', () => {
    naSacola += 1;
    avisarLoja(1);
    contagem.textContent = String(naSacola);
    sacola.setAttribute('aria-label', 'Sacola com ' + naSacola + ' itens');
    contagem.classList.remove('pulou');
    void contagem.offsetWidth;
    contagem.classList.add('pulou');
    clearTimeout(espera);
    botao.classList.add('feito');
    espera = setTimeout(() => botao.classList.remove('feito'), 1200);
  });
});
