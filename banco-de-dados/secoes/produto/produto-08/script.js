const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formulario = raiz.querySelector('.painel');
const qtdLanche = raiz.querySelector('.qtdLanche');
const totalValor = raiz.querySelector('.totalValor');
const usados = raiz.querySelector('.usados');
const blocoPonto = raiz.querySelector('.blocoPonto');
const adicionar = raiz.querySelector('.adicionar');
const aviso = raiz.querySelector('.aviso');
const pronto = raiz.querySelector('.pronto');
const prontoTexto = raiz.querySelector('.prontoTexto');
const opcoes = [...raiz.querySelectorAll('.opcao')];
const busca = raiz.querySelector('.buscaCampo');
const nadaAchado = raiz.querySelector('.nadaAchado');
const campoObs = raiz.querySelector('.observacaoCampo');
const precoBase = 38.9;
const maxAdicionais = 5;
const maxBebidas = 5;
let lanches = 1;

function pular(elemento) {
  elemento.classList.remove('mudou');
  void elemento.offsetWidth;
  elemento.classList.add('mudou');
}

// Cada adicional e bebida ganha os botões de menos e mais
const svgMenos = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
const svgMais = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
opcoes.forEach((opcao) => {
  const nome = opcao.dataset.nome;
  const passo = document.createElement('div');
  passo.className = 'passo';
  passo.setAttribute('role', 'group');
  passo.setAttribute('aria-label', 'Quantidade de ' + nome);
  passo.innerHTML = '<button class="passoBotao" type="button" data-delta="-1">' + svgMenos + '</button>'
    + '<output class="passoNumero">0</output>'
    + '<button class="passoBotao" type="button" data-delta="1">' + svgMais + '</button>';
  passo.children[0].setAttribute('aria-label', 'Tirar ' + nome);
  passo.children[2].setAttribute('aria-label', 'Pôr ' + nome);
  opcao.append(passo);
  opcao.qtd = 0;
});

const contar = (tipo) => opcoes.filter((o) => o.dataset.tipo === tipo).reduce((soma, o) => soma + o.qtd, 0);

function atualizar() {
  const totalAdicionais = contar('adicional');
  const totalBebidas = contar('bebida');
  const extras = opcoes.filter((o) => o.dataset.tipo === 'adicional').reduce((soma, o) => soma + o.qtd * parseFloat(o.dataset.preco), 0);
  const bebidas = opcoes.filter((o) => o.dataset.tipo === 'bebida').reduce((soma, o) => soma + o.qtd * parseFloat(o.dataset.preco), 0);
  const total = (precoBase + extras) * lanches + bebidas;

  usados.textContent = String(totalAdicionais);
  opcoes.forEach((opcao) => {
    const [menos, numero, mais] = opcao.querySelector('.passo').children;
    const limite = opcao.dataset.tipo === 'adicional' ? totalAdicionais >= maxAdicionais : totalBebidas >= maxBebidas;
    numero.textContent = String(opcao.qtd);
    menos.disabled = opcao.qtd === 0;
    mais.disabled = limite;
    opcao.classList.toggle('marcada', opcao.qtd > 0);
  });
  qtdLanche.textContent = String(lanches);
  raiz.querySelector('[data-passo="lanche"][data-delta="-1"]').disabled = lanches === 1;
  raiz.querySelector('[data-passo="lanche"][data-delta="1"]').disabled = lanches === 10;
  adicionar.setAttribute('aria-disabled', String(!formulario.querySelector('input[name="ponto"]:checked')));
  const novo = real.format(total);
  if (totalValor.textContent !== novo) {
    totalValor.textContent = novo;
    pular(totalValor);
  }
}

formulario.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.passoBotao');
  if (!botao || botao.disabled) return;
  const delta = Number(botao.dataset.delta);
  if (botao.dataset.passo === 'lanche') {
    lanches = Math.max(1, Math.min(10, lanches + delta));
    pular(qtdLanche);
  } else {
    const opcao = botao.closest('.opcao');
    opcao.qtd = Math.max(0, opcao.qtd + delta);
    pular(opcao.querySelector('.passoNumero'));
  }
  atualizar();
});

formulario.addEventListener('change', (evento) => {
  if (evento.target.name !== 'ponto') return;
  blocoPonto.classList.remove('falta');
  aviso.hidden = true;
  atualizar();
});

// Busca nos adicionais, sem diferença de acento e maiúscula
const simples = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
busca.addEventListener('input', () => {
  const termo = simples(busca.value.trim());
  let achados = 0;
  opcoes.filter((o) => o.dataset.tipo === 'adicional').forEach((opcao) => {
    const mostra = simples(opcao.dataset.nome).includes(termo);
    opcao.hidden = !mostra;
    if (mostra) achados += 1;
  });
  nadaAchado.hidden = achados > 0;
});

campoObs.addEventListener('input', () => {
  raiz.querySelector('.letras').textContent = String(campoObs.value.length);
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  if (!formulario.querySelector('input[name="ponto"]:checked')) {
    blocoPonto.classList.remove('falta');
    void blocoPonto.offsetWidth;
    blocoPonto.classList.add('falta');
    aviso.hidden = false;
    blocoPonto.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    return;
  }
  const bebidas = contar('bebida');
  avisarLoja(lanches + bebidas);
  const partes = [lanches + 'x Faísca 22'];
  if (bebidas) partes.push(bebidas === 1 ? '1 bebida' : bebidas + ' bebidas');
  prontoTexto.textContent = partes.join(' e ') + ' no carrinho';
  pronto.hidden = false;
});

atualizar();
