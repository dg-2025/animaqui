const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Monta as palavras do título aqui, para o texto continuar fácil de editar no HTML.
if (!reduzMovimento) {
  const titulo = raiz.querySelector('h1.titulo');
  raiz.querySelector('.luzTitulo').textContent = titulo.textContent.trim().replace(/\s+/g, ' ');
  let indice = 0;
  Array.from(titulo.childNodes).forEach(function (no) {
    const palavras = no.textContent.trim().split(/\s+/).filter(Boolean);
    if (palavras.length === 0) return;
    const destaque = no.nodeType === 1;
    const pedacos = document.createDocumentFragment();
    palavras.forEach(function (texto) {
      const mascara = document.createElement('span');
      mascara.className = 'mascara';
      const palavra = document.createElement('span');
      palavra.className = destaque ? 'palavra destaque' : 'palavra';
      palavra.style.setProperty('--i', indice);
      palavra.textContent = texto;
      mascara.appendChild(palavra);
      pedacos.append(mascara, ' ');
      indice += 1;
    });
    no.replaceWith(pedacos);
  });
}

// Carrossel: quem avança é o fim da animação da trilha ativa, assim pausar a trilha pausa tudo.
const carrossel = raiz.querySelector('.carrossel');
const slides = Array.from(raiz.querySelectorAll('.slide'));
const trilhas = Array.from(raiz.querySelectorAll('.trilha'));
const botaoPausa = raiz.querySelector('.botaoPausa');
let atual = 0;
let pausado = false;
let emInteracao = false;

function doisDigitos(numero) {
  return String(numero).padStart(2, '0');
}

function irPara(novo) {
  atual = novo;
  slides.forEach(function (slide, indice) {
    slide.classList.toggle('slideAtivo', indice === atual);
    slide.setAttribute('aria-hidden', String(indice !== atual));
  });
  trilhas.forEach(function (trilha, indice) {
    trilha.classList.toggle('concluida', indice < atual);
    trilha.setAttribute('aria-current', String(indice === atual));
  });
  // Trocar o elemento reinicia a animação de entrada do número.
  const numero = raiz.querySelector('.contadorAtual');
  const novoNumero = numero.cloneNode(false);
  novoNumero.textContent = doisDigitos(atual + 1);
  numero.replaceWith(novoNumero);
}

function aplicarParada() {
  carrossel.classList.toggle('parado', pausado || emInteracao);
}

raiz.addEventListener('animationend', function (evento) {
  if (evento.animationName === 'hero05Progresso') irPara((atual + 1) % slides.length);
});

trilhas.forEach(function (trilha, indice) {
  trilha.addEventListener('click', function () {
    irPara(indice);
  });
});

botaoPausa.addEventListener('click', function () {
  pausado = !pausado;
  carrossel.classList.toggle('pausado', pausado);
  botaoPausa.setAttribute('aria-label', pausado ? 'Retomar apresentação' : 'Pausar apresentação');
  aplicarParada();
});

function definirInteracao(valor) {
  return function () {
    emInteracao = valor;
    aplicarParada();
  };
}
carrossel.addEventListener('mouseenter', definirInteracao(true));
carrossel.addEventListener('mouseleave', definirInteracao(false));
carrossel.addEventListener('focusin', definirInteracao(true));
carrossel.addEventListener('focusout', definirInteracao(false));

new IntersectionObserver(function (itens) {
  raiz.classList.toggle('foraDaTela', !itens[0].isIntersecting);
}, { threshold: 0.15 }).observe(raiz);
