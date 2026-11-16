const categorias = raiz.querySelectorAll('.categoria');
const cupom = raiz.querySelector('.cupom');
const codigo = raiz.querySelector('.cupomCodigo');
let espera;

categorias.forEach((categoria) => {
  categoria.addEventListener('click', () => {
    categorias.forEach((outra) => outra.setAttribute('aria-pressed', String(outra === categoria)));
  });
});

raiz.querySelectorAll('.coracao').forEach((coracao) => {
  coracao.addEventListener('click', () => {
    coracao.setAttribute('aria-pressed', String(coracao.getAttribute('aria-pressed') !== 'true'));
  });
});

// Copia o cupom; se o navegador bloquear a área de transferência, o aviso aparece do mesmo jeito
cupom.addEventListener('click', () => {
  const texto = cupom.dataset.codigo;
  if (navigator.clipboard) navigator.clipboard.writeText(texto).catch(() => {});
  clearTimeout(espera);
  cupom.classList.add('copiado');
  codigo.textContent = 'Copiado!';
  espera = setTimeout(() => {
    cupom.classList.remove('copiado');
    codigo.textContent = texto;
  }, 1800);
});
