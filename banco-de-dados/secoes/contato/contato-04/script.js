// Demonstração: valida cada etapa e mostra a mensagem de sucesso, sem enviar nada.
const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cartao = raiz.querySelector('.cartao');
const formulario = raiz.querySelector('.formulario');
const sucesso = raiz.querySelector('.caixaSucesso');
const etapas = Array.from(raiz.querySelectorAll('.etapa'));
const passos = Array.from(raiz.querySelectorAll('.passo'));
const seletores = Array.from(raiz.querySelectorAll('.seletor'));
const progresso = raiz.querySelector('.progresso');
const barra = raiz.querySelector('.barra');
const contador = raiz.querySelector('.contador');
const erro = raiz.querySelector('.erro');
const voltar = raiz.querySelector('.botaoVoltar');
const avancar = raiz.querySelector('.botaoAvancar');
const textoAvancar = raiz.querySelector('.textoAvancar');
const telefone = raiz.querySelector('input[type="tel"]');
let atual = 0;

// Entrada em cascata do texto; sem JS ou com movimento reduzido, ele já aparece parado.
if (!semMovimento) {
  raiz.classList.add('animar');
  new IntersectionObserver(function (itens, observador) {
    if (!itens[0].isIntersecting) return;
    raiz.classList.add('visivel');
    observador.disconnect();
  }, { threshold: 0.1 }).observe(raiz);

  cartao.addEventListener('pointermove', function (evento) {
    const caixa = cartao.getBoundingClientRect();
    cartao.style.setProperty('--mouse-x', (evento.clientX - caixa.left) + 'px');
    cartao.style.setProperty('--mouse-y', (evento.clientY - caixa.top) + 'px');
  });
}

new IntersectionObserver(function (itens) {
  raiz.toggleAttribute('data-pausado', !itens[0].isIntersecting);
}).observe(raiz);

telefone.addEventListener('input', function () {
  const n = telefone.value.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 2) telefone.value = n;
  else if (n.length <= 6) telefone.value = '(' + n.slice(0, 2) + ') ' + n.slice(2);
  else if (n.length <= 10) telefone.value = '(' + n.slice(0, 2) + ') ' + n.slice(2, 6) + '-' + n.slice(6);
  else telefone.value = '(' + n.slice(0, 2) + ') ' + n.slice(2, 7) + '-' + n.slice(7);
});

function mostrarErro(texto, elemento) {
  erro.textContent = texto;
  erro.hidden = false;
  elemento.setAttribute('aria-invalid', 'true');
  elemento.focus();
}

function limparErro() {
  erro.hidden = true;
  raiz.querySelectorAll('[aria-invalid]').forEach(function (elemento) {
    elemento.removeAttribute('aria-invalid');
  });
}

function etapaValida() {
  limparErro();
  const campos = etapas[atual].querySelectorAll('[data-aviso]');
  for (const campo of campos) {
    if (campo.classList.contains('seletor')) {
      if (!campo.hasAttribute('data-preenchido')) {
        mostrarErro(campo.dataset.aviso, campo.querySelector('.gatilho'));
        return false;
      }
    } else {
      const vazio = campo === telefone
        ? campo.value.replace(/\D/g, '').length < 10
        : !campo.value.trim();
      if (vazio) {
        mostrarErro(campo.dataset.aviso, campo);
        return false;
      }
    }
  }
  return true;
}

function irPara(indice, focar) {
  etapas[atual].hidden = true;
  atual = indice;
  const etapa = etapas[atual];
  etapa.hidden = false;

  barra.style.setProperty('--progresso', (atual + 1) / etapas.length);
  progresso.setAttribute('aria-valuenow', atual + 1);
  contador.textContent = 'Etapa ' + (atual + 1) + ' de ' + etapas.length;
  passos.forEach(function (passo, i) {
    passo.classList.toggle('atual', i === atual);
    passo.classList.toggle('feito', i < atual);
  });
  voltar.hidden = atual === 0;
  textoAvancar.textContent = atual === etapas.length - 1 ? 'Quero meu diagnóstico' : 'Continuar';

  if (!focar) return;
  if (!semMovimento) {
    etapa.animate(
      [{ opacity: 0, transform: 'translateX(16px)' }, { opacity: 1, transform: 'none' }],
      { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }
  const primeiro = etapa.querySelector('input, .gatilho, textarea');
  if (primeiro) primeiro.focus();
}

voltar.addEventListener('click', function () {
  limparErro();
  irPara(atual - 1, true);
});

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  if (formulario.hasAttribute('data-enviando') || !etapaValida()) return;

  if (atual < etapas.length - 1) {
    irPara(atual + 1, true);
    return;
  }

  formulario.setAttribute('data-enviando', '');
  avancar.disabled = true;
  voltar.disabled = true;
  textoAvancar.textContent = 'Enviando...';
  setTimeout(function () {
    formulario.removeAttribute('data-enviando');
    avancar.disabled = false;
    voltar.disabled = false;
    formulario.hidden = true;
    sucesso.hidden = false;
    sucesso.focus();
  }, 1200);
});

raiz.querySelector('.botaoNovo').addEventListener('click', function () {
  formulario.reset();
  seletores.forEach(function (seletor) {
    const gatilho = seletor.querySelector('.gatilho');
    seletor.removeAttribute('data-preenchido');
    seletor.querySelector('.valor').textContent = seletor.dataset.vazio;
    gatilho.setAttribute('aria-label', seletor.dataset.nome + ': nenhum selecionado');
    seletor.querySelectorAll('.opcao').forEach(function (opcao) {
      opcao.setAttribute('aria-selected', 'false');
    });
  });
  sucesso.hidden = true;
  formulario.hidden = false;
  irPara(0, true);
});

// Lista de opções própria, com teclado: setas, Enter, Espaço e Esc.
function fechar(seletor, devolverFoco) {
  const gatilho = seletor.querySelector('.gatilho');
  seletor.querySelector('.menu').hidden = true;
  gatilho.setAttribute('aria-expanded', 'false');
  if (devolverFoco) gatilho.focus();
}

seletores.forEach(function (seletor) {
  const gatilho = seletor.querySelector('.gatilho');
  const menu = seletor.querySelector('.menu');
  const opcoes = Array.from(seletor.querySelectorAll('.opcao'));
  seletor.dataset.vazio = seletor.querySelector('.valor').textContent;

  function abrir() {
    seletores.forEach(function (outro) { fechar(outro, false); });
    menu.hidden = false;
    gatilho.setAttribute('aria-expanded', 'true');
    (menu.querySelector('[aria-selected="true"]') || opcoes[0]).focus();
  }

  function escolher(opcao) {
    opcoes.forEach(function (item) {
      item.setAttribute('aria-selected', item === opcao ? 'true' : 'false');
    });
    seletor.querySelector('.valor').textContent = opcao.textContent;
    seletor.setAttribute('data-preenchido', '');
    gatilho.setAttribute('aria-label', seletor.dataset.nome + ': ' + opcao.textContent);
    limparErro();
    fechar(seletor, true);
  }

  gatilho.addEventListener('click', function () {
    if (menu.hidden) abrir();
    else fechar(seletor, false);
  });

  gatilho.addEventListener('keydown', function (evento) {
    if (evento.key === 'ArrowDown' && menu.hidden) {
      evento.preventDefault();
      abrir();
    }
  });

  menu.addEventListener('click', function (evento) {
    const opcao = evento.target.closest('.opcao');
    if (opcao) escolher(opcao);
  });

  menu.addEventListener('keydown', function (evento) {
    const indice = opcoes.indexOf(evento.target);
    if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
      evento.preventDefault();
      const passo = evento.key === 'ArrowDown' ? 1 : -1;
      opcoes[(indice + passo + opcoes.length) % opcoes.length].focus();
    } else if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      escolher(evento.target);
    } else if (evento.key === 'Escape') {
      evento.preventDefault();
      fechar(seletor, true);
    } else if (evento.key === 'Tab') {
      fechar(seletor, false);
    }
  });
});

document.addEventListener('pointerdown', function (evento) {
  seletores.forEach(function (seletor) {
    if (!seletor.contains(evento.target)) fechar(seletor, false);
  });
});
