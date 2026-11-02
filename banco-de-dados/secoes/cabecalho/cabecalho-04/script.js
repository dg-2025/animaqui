// Comportamento ao rolar, em pixels
const LIMITE_COM_FUNDO = 50; // rolagem até ganhar fundo e encolher
const TOPO_SEMPRE_VISIVEL = 100; // perto do topo ele nunca some
const PARA_ESCONDER = 14; // descendo sem parar
const PARA_MOSTRAR = 6; // subindo sem parar

const barra = raiz.querySelector('.barra');
const botao = raiz.querySelector('.botaoMenu');
const painel = raiz.querySelector('.painel');
const itens = raiz.querySelectorAll('.itemPainel');
const telaLarga = window.matchMedia('(min-width: 1024px)');
const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

// Identificador único, pois a seção pode aparecer mais de uma vez na página
painel.id = 'painel-' + Math.random().toString(36).slice(2, 8);
botao.setAttribute('aria-controls', painel.id);

let ultimo = window.scrollY;
let acumulado = 0;
let quadro = 0;
let menuAberto = false;

// Sem espaço para rolar, y fica em 0 e o cabeçalho permanece visível, no estado do topo.
function atualizar() {
  quadro = 0;
  const fim = document.documentElement.scrollHeight - window.innerHeight;
  const y = Math.min(Math.max(window.scrollY, 0), Math.max(fim, 0));
  const delta = y - ultimo;
  ultimo = y;
  barra.classList.toggle('comFundo', y > LIMITE_COM_FUNDO);

  if (menuAberto) return;
  if (y <= TOPO_SEMPRE_VISIVEL) {
    acumulado = 0;
    barra.classList.remove('oculto');
    return;
  }
  if (delta === 0) return;
  if (delta > 0 !== acumulado > 0) acumulado = 0;
  acumulado += delta;
  if (acumulado > PARA_ESCONDER) barra.classList.add('oculto');
  else if (acumulado < -PARA_MOSTRAR) barra.classList.remove('oculto');
}

window.addEventListener('scroll', function () {
  if (!quadro) quadro = requestAnimationFrame(atualizar);
}, { passive: true });
atualizar();

// Tab em um link escondido traz o cabeçalho de volta
barra.addEventListener('focusin', function () {
  barra.classList.remove('oculto');
});

function duracaoDoToken(nome) {
  const valor = getComputedStyle(raiz).getPropertyValue(nome).trim();
  const numero = parseFloat(valor) || 0;
  return valor.endsWith('ms') ? numero : numero * 1000;
}

// Os links entram em cascata enquanto o painel desliza
function animarLinks() {
  if (movimentoReduzido.matches) return;
  const lenta = duracaoDoToken('--duracao-lenta');
  const rapida = duracaoDoToken('--duracao-rapida');
  const curva = getComputedStyle(raiz).getPropertyValue('--curva-entrada').trim() || 'ease-out';
  itens.forEach(function (item, indice) {
    item.animate([
      { opacity: 0, transform: 'translate3d(32px, 0, 0)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    ], { duration: lenta, delay: rapida + indice * rapida / 2, easing: curva, fill: 'backwards' });
  });
}

function aoTeclar(evento) {
  if (evento.key !== 'Escape') return;
  definirMenu(false);
  botao.focus();
}

function definirMenu(aberto) {
  if (menuAberto === aberto) return;
  menuAberto = aberto;
  painel.classList.toggle('aberto', aberto);
  botao.setAttribute('aria-expanded', String(aberto));
  botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  document.body.style.overflow = aberto ? 'hidden' : '';
  if (aberto) {
    barra.classList.remove('oculto');
    window.addEventListener('keydown', aoTeclar);
    animarLinks();
  } else {
    window.removeEventListener('keydown', aoTeclar);
    atualizar();
  }
}

botao.addEventListener('click', function () {
  definirMenu(!menuAberto);
});

painel.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    definirMenu(false);
  });
});

telaLarga.addEventListener('change', function (evento) {
  if (evento.matches) definirMenu(false);
});
