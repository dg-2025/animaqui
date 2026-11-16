const avisarLoja = (quantidade) => raiz.dispatchEvent(new CustomEvent('loja:item', { bubbles: true, detail: { quantidade } }));
const formulario = raiz.querySelector('.info');
const galeria = raiz.querySelector('.galeria');
const fotos = [...raiz.querySelectorAll('.foto')];
const pontos = raiz.querySelectorAll('.ponto');
const corNome = raiz.querySelector('.corNome');
const tamanhos = raiz.querySelector('.tamanhos');
const comprar = raiz.querySelector('.comprar');
const texto = raiz.querySelector('.comprarTexto');
const favoritar = raiz.querySelector('.favoritar');
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let espera;

favoritar.addEventListener('click', () => {
  favoritar.setAttribute('aria-pressed', String(favoritar.getAttribute('aria-pressed') !== 'true'));
});

function marcarPonto(indice) {
  pontos.forEach((ponto, i) => ponto.classList.toggle('ativo', i === indice));
}

// Escolher a cor leva a galeria até a foto dela
formulario.querySelectorAll('input[name="cor"]').forEach((entrada) => {
  entrada.addEventListener('change', () => {
    const indice = fotos.findIndex((foto) => foto.dataset.cor === entrada.value);
    corNome.textContent = entrada.dataset.nome;
    marcarPonto(indice);
    galeria.scrollTo({ left: indice * galeria.clientWidth, behavior: reduzir ? 'auto' : 'smooth' });
  });
});

// E deslizar a galeria troca a cor marcada
let rolagem;
galeria.addEventListener('scroll', () => {
  clearTimeout(rolagem);
  rolagem = setTimeout(() => {
    const indice = Math.round(galeria.scrollLeft / galeria.clientWidth);
    const entrada = formulario.querySelector('input[name="cor"][value="' + fotos[indice].dataset.cor + '"]');
    marcarPonto(indice);
    if (entrada && !entrada.checked) {
      entrada.checked = true;
      corNome.textContent = entrada.dataset.nome;
    }
  }, 120);
}, { passive: true });

function atualizarBotao() {
  const tamanho = formulario.querySelector('input[name="tamanho"]:checked');
  comprar.classList.toggle('aguardando', !tamanho);
  texto.textContent = tamanho ? 'Adicionar à sacola · ' + tamanho.value : 'Escolha o tamanho';
}

formulario.addEventListener('change', (evento) => {
  if (evento.target.name === 'tamanho') atualizarBotao();
});

// Sem número escolhido, o botão aponta para a grade em vez de comprar
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const tamanho = formulario.querySelector('input[name="tamanho"]:checked');
  if (!tamanho) {
    tamanhos.classList.remove('lembrar');
    void tamanhos.offsetWidth;
    tamanhos.classList.add('lembrar');
    formulario.querySelector('input[name="tamanho"]:not(:disabled)').focus();
    return;
  }
  clearTimeout(espera);
  avisarLoja(1);
  comprar.classList.add('feito');
  texto.textContent = 'Na sacola · ' + tamanho.value;
  espera = setTimeout(() => {
    comprar.classList.remove('feito');
    atualizarBotao();
  }, 1800);
});

atualizarBotao();
