const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const chips = [...raiz.querySelectorAll('.chip')];
const pedidos = [...raiz.querySelectorAll('.pedido')];
const vazio = raiz.querySelector('.vazio');
let filtro = 'todos';

// Número de pedidos em cada filtro
function contar() {
  chips.forEach((chip) => {
    const f = chip.dataset.filtro;
    const n = pedidos.filter((pedido) => f === 'todos' || pedido.dataset.grupo === f).length;
    chip.querySelector('.chipNumero').textContent = String(n);
  });
}

function filtrar() {
  let visiveis = 0;
  pedidos.forEach((pedido) => {
    const passa = filtro === 'todos' || pedido.dataset.grupo === filtro;
    pedido.hidden = !passa;
    if (passa) visiveis += 1;
  });
  vazio.hidden = visiveis > 0;
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    filtro = chip.dataset.filtro;
    chips.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === chip)));
    filtrar();
  });
});

// Ver detalhes: abre deslizando e fecha do mesmo jeito
pedidos.forEach((pedido) => {
  const abrir = pedido.querySelector('.abrir');
  const detalhe = pedido.querySelector('.detalhe');
  abrir.addEventListener('click', () => {
    const abrindo = abrir.getAttribute('aria-expanded') !== 'true';
    abrir.setAttribute('aria-expanded', String(abrindo));
    abrir.firstChild.textContent = abrindo ? 'Fechar ' : 'Detalhes ';
    if (abrindo) {
      detalhe.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => detalhe.classList.add('aberto')));
    } else {
      detalhe.classList.remove('aberto');
      setTimeout(() => { if (abrir.getAttribute('aria-expanded') === 'false') detalhe.hidden = true; }, reduzir ? 0 : 300);
    }
  });

  // Copiar o código de rastreio
  const copiar = pedido.querySelector('.copiar');
  if (copiar) {
    copiar.addEventListener('click', () => {
      const codigo = pedido.querySelector('.codigo').textContent;
      const pronto = () => {
        copiar.classList.add('feito');
        copiar.querySelector('span').textContent = 'Copiado';
        setTimeout(() => {
          copiar.classList.remove('feito');
          copiar.querySelector('span').textContent = 'Copiar';
        }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(codigo).then(pronto, pronto);
      else pronto();
    });
  }

  // Já paguei: o pedido passa para "Em separação" e a linha do tempo anda
  const pagar = pedido.querySelector('.pagar');
  if (pagar) {
    pagar.addEventListener('click', () => {
      const badge = pedido.querySelector('.badge');
      badge.className = 'badge separacao trocou';
      badge.textContent = 'Em separação';
      const passos = [...pedido.querySelectorAll('.linhaTempo li')];
      passos.forEach((passo, i) => {
        passo.classList.toggle('feito', i < 2);
        passo.classList.toggle('agora', i === 2);
      });
      pedido.querySelector('.formaPagamento').textContent = 'Pix · confirmado';
      pagar.hidden = true;
    });
  }

  // Comprar de novo: devolve os itens do pedido para a sacola
  const repetir = pedido.querySelector('.repetir');
  if (repetir) {
    let espera;
    repetir.addEventListener('click', () => {
      avisarLoja(Number(repetir.dataset.quantidade) || 1);
      clearTimeout(espera);
      repetir.classList.add('feito');
      repetir.lastChild.textContent = 'Na sacola';
      espera = setTimeout(() => {
        repetir.classList.remove('feito');
        repetir.lastChild.textContent = 'Comprar de novo';
      }, 1600);
    });
  }
});

contar();
filtrar();
