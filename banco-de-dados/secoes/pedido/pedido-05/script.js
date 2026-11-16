const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const pedidos = [...raiz.querySelectorAll('.pedido')];
const aviso = raiz.querySelector('.aviso');
const recibo = raiz.querySelector('.recibo');
const rotulos = { preparando: 'Em preparo', saiu: 'Saiu para entrega', entregue: 'Entregue', cancelado: 'Cancelado' };

// Ids únicos: o mesmo bloco pode aparecer duas vezes na página
const sufixo = Math.random().toString(36).slice(2, 7);
raiz.querySelectorAll('[id]').forEach((elemento) => { elemento.id += '-' + sufixo; });
raiz.querySelectorAll('[aria-controls]').forEach((elemento) => elemento.setAttribute('aria-controls', elemento.getAttribute('aria-controls') + '-' + sufixo));

// A barra enche até a etapa atual (0 a 4); cancelado fica vazio
function desenhar(pedido) {
  const etapa = Number(pedido.dataset.etapa);
  pedido.querySelector('.barra').style.width = etapa < 0 ? '0%' : (etapa / 4) * 100 + '%';
  pedido.querySelectorAll('.etapas li').forEach((li, i) => li.classList.toggle('feita', etapa >= i));
  pedido.querySelector('.estado').textContent = rotulos[pedido.dataset.status];
}

pedidos.forEach((pedido) => {
  const topo = pedido.querySelector('.pedidoTopo');
  const detalhes = pedido.querySelector('.detalhes');
  topo.addEventListener('click', () => {
    const abrir = topo.getAttribute('aria-expanded') !== 'true';
    topo.setAttribute('aria-expanded', String(abrir));
    detalhes.hidden = !abrir;
  });

  pedido.querySelector('.pedirDeNovo').addEventListener('click', () => {
    const qtd = Number(pedido.dataset.qtd);
    avisarLoja(qtd);
    mostrarAviso(qtd === 1 ? '1 item voltou para o carrinho' : qtd + ' itens voltaram para o carrinho');
  });

  pedido.querySelector('.verRecibo').addEventListener('click', () => abrirRecibo(pedido));
  // A barra cresce depois de pintar, para a transição aparecer
  requestAnimationFrame(() => requestAnimationFrame(() => desenhar(pedido)));
});

let tempoAviso;
function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.hidden = false;
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(() => { aviso.hidden = true; }, 3200);
}

function abrirRecibo(pedido) {
  const linha = (rotulo, valor, classe) => {
    const div = document.createElement('div');
    if (classe) div.className = classe;
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = rotulo;
    dd.textContent = valor;
    div.append(dt, dd);
    return div;
  };
  recibo.querySelector('.reciboNumero').textContent = pedido.querySelector('.pedidoId strong').textContent;
  recibo.querySelector('.reciboData').textContent = pedido.querySelector('.pedidoData').textContent.trim();
  recibo.querySelector('.reciboItens').replaceChildren(...[...pedido.querySelectorAll('.itens li')].map((li) => li.cloneNode(true)));
  const contas = [...pedido.querySelectorAll('.dados div')]
    .filter((div) => !div.classList.contains('dadoLargo'))
    .map((div) => linha(div.querySelector('dt').textContent, div.querySelector('dd').textContent));
  contas.push(linha('Total', pedido.querySelector('.pedidoTotal').textContent, 'reciboTotal'));
  recibo.querySelector('.reciboContas').replaceChildren(...contas);
  if (typeof recibo.showModal === 'function') recibo.showModal();
  else recibo.setAttribute('open', '');
}

function fecharRecibo() {
  if (typeof recibo.close === 'function') recibo.close();
  else recibo.removeAttribute('open');
}
raiz.querySelector('.fecharRecibo').addEventListener('click', fecharRecibo);
recibo.addEventListener('click', (evento) => { if (evento.target === recibo) fecharRecibo(); });

// "Ao vivo": o pedido de hoje sai para entrega alguns segundos depois de abrir
const emPreparo = pedidos.find((pedido) => pedido.dataset.status === 'preparando');
if (emPreparo) {
  setTimeout(() => {
    emPreparo.dataset.status = 'saiu';
    emPreparo.dataset.etapa = '3';
    desenhar(emPreparo);
    emPreparo.classList.remove('mudou');
    void emPreparo.offsetWidth;
    emPreparo.classList.add('mudou');
    mostrarAviso('Pedido ' + emPreparo.querySelector('.pedidoId strong').textContent + ' saiu para entrega');
  }, 7000);
}
