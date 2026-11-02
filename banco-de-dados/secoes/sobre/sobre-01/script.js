const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const valores = raiz.querySelectorAll('.valor');

function contar(elemento) {
  const fim = Number(elemento.dataset.valor);
  const sufixo = elemento.dataset.sufixo || '';
  const token = getComputedStyle(raiz).getPropertyValue('--duracao-ciclo').trim();
  const duracao = (parseFloat(token) * (token.endsWith('ms') ? 1 : 1000) || 4000) / 2;
  const inicio = performance.now();

  function quadro(agora) {
    const avanco = Math.min((agora - inicio) / duracao, 1);
    const curva = 1 - Math.pow(2, -10 * avanco);
    elemento.textContent = `${Math.round(fim * (avanco === 1 ? 1 : curva))}${sufixo}`;
    if (avanco < 1) requestAnimationFrame(quadro);
  }

  requestAnimationFrame(quadro);
}

const loop = new IntersectionObserver((entradas) => {
  raiz.classList.toggle('naTela', entradas[0].isIntersecting);
});
loop.observe(raiz);

if (!calmo) {
  raiz.classList.add('preparado');
  valores.forEach((valor) => {
    valor.textContent = `0${valor.dataset.sufixo || ''}`;
  });

  const entrada = new IntersectionObserver((entradas) => {
    if (!entradas[0].isIntersecting) return;
    raiz.classList.add('visivel');
    valores.forEach(contar);
    entrada.disconnect();
  }, { threshold: 0.2 });

  entrada.observe(raiz);
}
