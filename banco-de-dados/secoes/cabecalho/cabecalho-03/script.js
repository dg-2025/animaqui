// Comportamento ao rolar, em pixels
const LIMITE_COM_FUNDO = 24; // rolagem até ficar quase sólido
const TOPO_SEMPRE_VISIVEL = 80; // perto do topo ele nunca some
const PARA_ESCONDER = 14; // descendo sem parar
const PARA_MOSTRAR = 6; // subindo sem parar

const barra = raiz.querySelector('.barra');
const botao = raiz.querySelector('.botaoMenu');
const menu = raiz.querySelector('.menuCelular');
const telaLarga = window.matchMedia('(min-width: 768px)');
const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

// Identificador único, pois a seção pode aparecer mais de uma vez na página
menu.id = 'menu-' + Math.random().toString(36).slice(2, 8);
botao.setAttribute('aria-controls', menu.id);

let ultimo = window.scrollY;
let acumulado = 0;
let quadro = 0;
let menuAberto = false;
let saida = null;

// Sem espaço para rolar, y fica em 0 e o cabeçalho permanece visível, no estado do topo.
function atualizar() {
  quadro = 0;
  const fim = document.documentElement.scrollHeight - window.innerHeight;
  // Ignora o elástico do celular acima do topo e abaixo do fim
  const y = Math.min(Math.max(window.scrollY, 0), Math.max(fim, 0));
  const delta = y - ultimo;
  ultimo = y;
  barra.classList.toggle('comFundo', y > LIMITE_COM_FUNDO || menuAberto);

  if (menuAberto) return;
  if (y <= TOPO_SEMPRE_VISIVEL) {
    acumulado = 0;
    barra.classList.remove('oculto');
    return;
  }
  if (delta === 0) return;
  if (delta > 0 !== acumulado > 0) acumulado = 0; // trocou de sentido: zera
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

function aoTeclar(evento) {
  if (evento.key !== 'Escape') return;
  fecharMenu();
  botao.focus();
}

function abrirMenu() {
  if (saida) saida.cancel();
  saida = null;
  menuAberto = true;
  menu.hidden = false;
  botao.setAttribute('aria-expanded', 'true');
  botao.setAttribute('aria-label', 'Fechar menu');
  barra.classList.remove('oculto');
  barra.classList.add('comFundo');
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', aoTeclar);
}

function terminarFechamento() {
  menu.hidden = true;
  saida = null;
}

function fecharMenu() {
  if (!menuAberto) return;
  menuAberto = false;
  botao.setAttribute('aria-expanded', 'false');
  botao.setAttribute('aria-label', 'Abrir menu');
  document.body.style.overflow = '';
  window.removeEventListener('keydown', aoTeclar);
  atualizar();

  if (movimentoReduzido.matches || telaLarga.matches) {
    terminarFechamento();
    return;
  }
  const curva = getComputedStyle(raiz).getPropertyValue('--curva-saida').trim() || 'ease-in';
  saida = menu.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: duracaoDoToken('--duracao-rapida'),
    easing: curva,
    fill: 'forwards',
  });
  saida.onfinish = terminarFechamento;
}

botao.addEventListener('click', function () {
  if (menuAberto) fecharMenu();
  else abrirMenu();
});

menu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', fecharMenu);
});

telaLarga.addEventListener('change', function (evento) {
  if (evento.matches) fecharMenu();
});
