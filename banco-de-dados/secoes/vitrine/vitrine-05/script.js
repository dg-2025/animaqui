const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const filtros = raiz.querySelectorAll('.filtro');
const plantas = raiz.querySelectorAll('.grade .planta');
const cuidados = raiz.querySelector('.cuidados');
const selo = raiz.querySelector('.selo');
const carrinho = raiz.querySelector('.carrinho');
const textos = {
  interior: { planta: 'babosa', rega: 'Semanal', luz: 'Indireta', pets: 'Cuidado' },
  exterior: { planta: 'echeveria', rega: 'Quinzenal', luz: 'Sol pleno', pets: 'Segura' },
  suculenta: { planta: 'suculentas', rega: 'A cada 15 dias', luz: 'Muita luz', pets: 'Varia' },
  pet: { planta: 'haworthia', rega: 'Quinzenal', luz: 'Meia-sombra', pets: 'Segura' },
};

// O filtro troca as plantas e o cartão de cuidados
filtros.forEach((filtro) => {
  filtro.addEventListener('click', () => {
    const tipo = filtro.dataset.filtro;
    const texto = textos[tipo];
    filtros.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === filtro)));
    plantas.forEach((planta) => {
      planta.hidden = !planta.dataset.tipos.split(' ').includes(tipo);
    });
    cuidados.querySelector('.plantaNome').textContent = texto.planta;
    cuidados.querySelector('.rega').textContent = texto.rega;
    cuidados.querySelector('.luz').textContent = texto.luz;
    cuidados.querySelector('.pets').textContent = texto.pets;
    cuidados.classList.remove('trocou');
    void cuidados.offsetWidth;
    cuidados.classList.add('trocou');
  });
});

let noCarrinho = Number(selo.textContent);
raiz.querySelectorAll('.somar').forEach((botao) => {
  botao.addEventListener('click', () => {
    noCarrinho += 1;
    avisarLoja(1);
    selo.textContent = String(noCarrinho);
    carrinho.setAttribute('aria-label', 'Carrinho com ' + noCarrinho + ' itens');
    selo.classList.remove('pulou');
    void selo.offsetWidth;
    selo.classList.add('pulou');
  });
});

// Começa mostrando só as de interior, como o filtro marcado
filtros[0].click();
