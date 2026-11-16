const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const lista = raiz.querySelector('.vistaLista');
const detalhe = raiz.querySelector('.vistaDetalhe');
const cartoes = [...raiz.querySelectorAll('.cartaoPedido')];
const filtros = [...raiz.querySelectorAll('.filtro')];
const semPedidos = raiz.querySelector('.semPedidos');
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const marcoCerto = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const marcoRelogio = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';

// Dados de exemplo de cada pedido: itens, valores e histórico
const pedidos = [
  {
    pagamento: 'PIX', frete: 0, rastreio: 'BR 4821 3907 6TM',
    itens: [['Moletom Canguru Musgo', 'M · Verde-musgo', 1, 289.9], ['Calça Cargo Preta', '42', 1, 249.9], ['Boné Aba Curva Gelo', 'U', 2, 99.9]],
    historico: [['Pedido recebido', '14/11/2026 · 19:42'], ['Pagamento confirmado', '14/11/2026 · 19:43', 'Pix aprovado na hora'], ['Separando', '15/11/2026 · 09:10'], ['Enviado', '15/11/2026 · 16:28', 'Saiu do centro de distribuição']],
  },
  {
    pagamento: 'BOLETO', frete: 24.9, rastreio: '',
    itens: [['Camiseta Oversized Off-White', 'G', 1, 129.9]],
    historico: [['Aguardando pagamento', '13/11/2026 · 10:05', 'O boleto vence em 16/11/2026']],
  },
  {
    pagamento: 'CARTÃO 3X', frete: 0, rastreio: 'BR 3390 1288 4TM',
    itens: [['Jaqueta Puffer Grafite', 'M', 1, 459.9], ['Tênis Skate Cano Baixo', '41', 1, 379.9]],
    historico: [['Pedido recebido', '28/10/2026 · 21:16'], ['Pagamento confirmado', '28/10/2026 · 21:16'], ['Enviado', '29/10/2026 · 14:02'], ['Entregue', '31/10/2026 · 11:47', 'Recebido por Ana']],
  },
  {
    pagamento: 'CARTÃO 1X', frete: 0, rastreio: '',
    itens: [['Bolsa Transversal Amarela', 'U', 1, 139.9]],
    historico: [['Pedido recebido', '09/10/2026 · 08:30'], ['Cancelado', '09/10/2026 · 09:02', 'Cancelado a pedido do cliente. Valor estornado.']],
  },
];

// Filtro por situação
filtros.forEach((botao) => botao.addEventListener('click', () => {
  const grupo = botao.dataset.status;
  let visiveis = 0;
  filtros.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === botao)));
  cartoes.forEach((cartao) => {
    const mostra = !grupo || cartao.dataset.grupo === grupo;
    cartao.hidden = !mostra;
    if (mostra) visiveis += 1;
  });
  semPedidos.hidden = visiveis > 0;
}));

function linha(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

let cartaoAberto = null;

function abrir(cartao) {
  const dados = pedidos[Number(cartao.dataset.pedido)];
  const fotos = [...cartao.querySelectorAll('.miniFotos img')];
  cartaoAberto = cartao;
  const subtotal = dados.itens.reduce((soma, item) => soma + item[2] * item[3], 0);
  detalhe.querySelector('.detalheTitulo').textContent = cartao.querySelector('.idPedido').textContent;
  detalhe.querySelector('.badge').replaceWith(cartao.querySelector('.badge').cloneNode(true));
  detalhe.querySelector('.cartaoTopo .badge, .detalheTopo .badge').classList.add('badgeGrande');
  detalhe.querySelector('.detalheData').textContent = cartao.querySelector('.data').textContent;
  detalhe.querySelector('.detalhePagamento').textContent = dados.pagamento;
  detalhe.querySelector('.detalheTotal').textContent = real.format(subtotal + dados.frete);
  detalhe.querySelector('.rastreio').hidden = !dados.rastreio;
  detalhe.querySelector('.codigo').textContent = dados.rastreio;
  detalhe.querySelector('.itensDetalhe').replaceChildren(...dados.itens.map(([nome, variacao, qtd, preco], i) => {
    const item = linha('li');
    const foto = linha('img');
    foto.src = fotos[i] ? fotos[i].src : fotos[0].src;
    foto.alt = '';
    const info = linha('div', 'itemInfo');
    info.append(linha('span', 'itemNome', qtd + 'x ' + nome), linha('span', 'itemDetalhe', 'Tamanho: ' + variacao));
    item.append(foto, info, linha('span', 'itemPreco', real.format(qtd * preco)));
    return item;
  }));
  detalhe.querySelector('.detalheSubtotal').textContent = real.format(subtotal);
  detalhe.querySelector('.detalheFrete').textContent = dados.frete ? real.format(dados.frete) : 'Grátis';
  detalhe.querySelector('.detalheTotal2').textContent = real.format(subtotal + dados.frete);
  detalhe.querySelector('.linhaTempo').replaceChildren(...dados.historico.map(([status, data, obs], i) => {
    const marco = linha('li', i === dados.historico.length - 1 ? 'ultimo' : '');
    const icone = linha('span', 'marco');
    icone.innerHTML = i === dados.historico.length - 1 ? marcoCerto : marcoRelogio;
    const texto = linha('div', 'marcoTexto');
    texto.append(linha('strong', '', status), linha('span', '', data));
    if (obs) texto.append(linha('em', '', obs));
    marco.append(icone, texto);
    return marco;
  }));
  lista.hidden = true;
  detalhe.hidden = false;
  detalhe.focus();
  raiz.scrollIntoView({ block: 'start', behavior: reduzir ? 'auto' : 'smooth' });
}

raiz.addEventListener('click', (evento) => {
  const ver = evento.target.closest('.verDetalhes');
  if (ver) abrir(ver.closest('.cartaoPedido'));
});

detalhe.querySelector('.voltar').addEventListener('click', () => {
  detalhe.hidden = true;
  lista.hidden = false;
  if (cartaoAberto) cartaoAberto.querySelector('.verDetalhes').focus();
});

const copiar = detalhe.querySelector('.copiar');
copiar.addEventListener('click', () => {
  const codigo = detalhe.querySelector('.codigo').textContent;
  if (navigator.clipboard) navigator.clipboard.writeText(codigo).catch(() => {});
  copiar.textContent = 'Copiado!';
  copiar.classList.add('copiado');
  setTimeout(() => {
    copiar.textContent = 'Copiar';
    copiar.classList.remove('copiado');
  }, 1600);
});
