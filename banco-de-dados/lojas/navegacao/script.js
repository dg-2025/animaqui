const paginas = [...document.querySelectorAll('.lojaPagina')];
const links = [...raiz.querySelectorAll('.link')];
const carrinho = raiz.querySelector('.carrinho');
const contagem = raiz.querySelector('.contagem');
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let itens = 0;

// Páginas curtas não mostram o fundo escuro do tema: a página toda usa o fundo claro da loja
document.body.style.background = getComputedStyle(raiz).getPropertyValue('--fundo-pagina');

// Mostra uma página da loja e marca o link dela; as outras ficam escondidas
function mostrar(id, rolar) {
  const alvo = paginas.find((pagina) => pagina.dataset.pagina === id);
  if (!alvo) return;
  paginas.forEach((pagina) => { pagina.hidden = pagina !== alvo; });
  links.forEach((link) => {
    if (link.dataset.ir === id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  try { history.replaceState(null, '', '#/' + id); } catch (erro) { /* documento sem endereço, como no palco */ }
  if (rolar) window.scrollTo({ top: 0, behavior: reduzir ? 'auto' : 'smooth' });
}

// Qualquer botão ou link com data-ir leva à página indicada, inclusive dentro das seções
document.addEventListener('click', (evento) => {
  const gatilho = evento.target.closest('[data-ir]');
  if (!gatilho) return;
  const id = gatilho.dataset.ir;
  if (!paginas.some((pagina) => pagina.dataset.pagina === id)) return;
  evento.preventDefault();
  mostrar(id, true);
});

// As seções avisam quando algo entra ou sai do carrinho; o número vale para todas as páginas
document.addEventListener('loja:item', (evento) => {
  itens = Math.max(0, itens + (Number(evento.detail && evento.detail.quantidade) || 0));
  contagem.textContent = String(itens);
  contagem.hidden = itens === 0;
  carrinho.setAttribute('aria-label', itens === 0 ? 'Carrinho vazio' : 'Carrinho com ' + itens + (itens === 1 ? ' item' : ' itens'));
  contagem.classList.remove('pulou');
  void contagem.offsetWidth;
  contagem.classList.add('pulou');
});

const pedida = (location.hash.match(/^#\/([\w-]+)/) || [])[1];
const inicial = paginas.find((pagina) => pagina.dataset.pagina === pedida) || paginas.find((pagina) => !pagina.hidden) || paginas[0];
if (inicial) mostrar(inicial.dataset.pagina, false);
