const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const numero = raiz.querySelector('.pontosNumero');
const clube = raiz.querySelector('.clube');
const interruptor = raiz.querySelector('.interruptor');
const aviso = raiz.querySelector('.aviso');
const alvo = Number(numero.dataset.alvo);
const formato = new Intl.NumberFormat('pt-BR');

// Os pontos contam até o total quando o cartão aparece
function contar() {
  if (reduzir) {
    numero.textContent = formato.format(alvo);
    return;
  }
  clube.classList.add('animar');
  const inicio = performance.now();
  const duracao = 900;
  function quadro(agora) {
    const t = Math.min(1, (agora - inicio) / duracao);
    numero.textContent = formato.format(Math.round(alvo * (1 - Math.pow(1 - t, 3))));
    if (t < 1) requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);
}

if ('IntersectionObserver' in window && !reduzir) {
  new IntersectionObserver((entradas, observador) => {
    if (!entradas[0].isIntersecting) return;
    contar();
    observador.disconnect();
  }, { threshold: 0.4 }).observe(clube);
} else {
  contar();
}

interruptor.addEventListener('click', () => {
  const ligado = interruptor.getAttribute('aria-checked') !== 'true';
  interruptor.setAttribute('aria-checked', String(ligado));
  aviso.textContent = ligado ? 'Notificações ligadas.' : 'Notificações desligadas. Você ainda recebe e-mails de pedido.';
});

raiz.querySelector('.sair').addEventListener('click', () => {
  aviso.textContent = 'Você saiu da conta (exemplo).';
});
