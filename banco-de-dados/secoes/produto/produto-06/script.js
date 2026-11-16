const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const principal = raiz.querySelector('.principal');
const miniaturas = [...raiz.querySelectorAll('.miniatura')];
const contadorFoto = raiz.querySelector('.contadorFoto');
const numero = raiz.querySelector('.numero');
const menos = raiz.querySelector('.menos');
const mais = raiz.querySelector('.mais');
const comprar = raiz.querySelector('.comprar');
const comprarTexto = raiz.querySelector('.comprarTexto');
const badge = raiz.querySelector('.badge');
const aviso = raiz.querySelector('.aviso');
const avisoTexto = raiz.querySelector('.avisoTexto');
let foto = 0;
let estoque = 4;
let quantidade = 1;
let espera;

// Troca a foto principal pela miniatura escolhida, com um esmaecer curto
function mostrarFoto(indice) {
  foto = (indice + miniaturas.length) % miniaturas.length;
  const img = miniaturas[foto].querySelector('img');
  miniaturas.forEach((mini, i) => mini.setAttribute('aria-pressed', String(i === foto)));
  contadorFoto.textContent = (foto + 1) + ' / ' + miniaturas.length;
  const trocar = () => {
    principal.src = img.src;
    principal.alt = img.alt;
    principal.classList.remove('trocando');
  };
  if (reduzir) { trocar(); return; }
  principal.classList.add('trocando');
  setTimeout(trocar, 180);
}

miniaturas.forEach((mini, indice) => {
  mini.addEventListener('click', () => mostrarFoto(indice));
  mini.addEventListener('keydown', (evento) => {
    if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return;
    evento.preventDefault();
    mostrarFoto(foto + (evento.key === 'ArrowRight' ? 1 : -1));
    miniaturas[foto].focus();
  });
});

raiz.querySelector('.anterior').addEventListener('click', () => mostrarFoto(foto - 1));
raiz.querySelector('.proxima').addEventListener('click', () => mostrarFoto(foto + 1));

// Arrastar o dedo na foto também passa as fotos
let inicioToque = null;
const fotoPrincipal = raiz.querySelector('.fotoPrincipal');
fotoPrincipal.addEventListener('touchstart', (evento) => { inicioToque = evento.touches[0].clientX; }, { passive: true });
fotoPrincipal.addEventListener('touchend', (evento) => {
  if (inicioToque === null) return;
  const distancia = evento.changedTouches[0].clientX - inicioToque;
  if (Math.abs(distancia) > 40) mostrarFoto(foto + (distancia < 0 ? 1 : -1));
  inicioToque = null;
});

function atualizar() {
  quantidade = Math.min(Math.max(quantidade, estoque ? 1 : 0), estoque);
  numero.textContent = String(quantidade);
  menos.disabled = quantidade <= 1;
  mais.disabled = quantidade >= estoque;
  comprar.disabled = estoque === 0;
  if (!comprar.classList.contains('feito')) comprarTexto.textContent = estoque ? 'Adicionar à sacola' : 'Peça esgotada';
  badge.textContent = estoque ? estoque + (estoque === 1 ? ' disponível' : ' disponíveis') : 'Esgotada';
  badge.classList.toggle('pouco', estoque <= 2);
}

menos.addEventListener('click', () => { quantidade -= 1; atualizar(); });
mais.addEventListener('click', () => { quantidade += 1; atualizar(); });

// Pôr na sacola: avisa a loja com a quantidade e baixa o estoque mostrado
comprar.addEventListener('click', () => {
  if (!estoque) return;
  const levou = quantidade;
  avisarLoja(levou);
  estoque -= levou;
  quantidade = 1;
  clearTimeout(espera);
  comprar.classList.add('feito');
  comprarTexto.textContent = levou === 1 ? 'Na sacola' : levou + ' na sacola';
  avisoTexto.textContent = levou === 1 ? '1 par na sacola.' : levou + ' pares na sacola.';
  aviso.hidden = false;
  atualizar();
  espera = setTimeout(() => {
    comprar.classList.remove('feito');
    atualizar();
  }, 1800);
});

atualizar();
