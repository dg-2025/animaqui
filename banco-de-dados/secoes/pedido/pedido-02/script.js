const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desenho = raiz.querySelector('.qrDesenho');
const tempo = raiz.querySelector('.tempo');
const copiar = raiz.querySelector('.copiar');
const codigo = raiz.querySelector('.codigoPix');
const aguardando = raiz.querySelector('.aguardando');
const pago = raiz.querySelector('.pago');
const vencido = raiz.querySelector('.vencido');
const lado = 29;
let relogio;

// Desenha um QR de exemplo: três quadros de canto e o miolo sorteado
function desenharQr() {
  const ns = 'http://www.w3.org/2000/svg';
  desenho.textContent = '';
  const quadro = (x, y) => {
    for (let i = 0; i < 7; i += 1) {
      for (let j = 0; j < 7; j += 1) {
        const borda = i === 0 || i === 6 || j === 0 || j === 6;
        const miolo = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        if (borda || miolo) pintar(x + i, y + j);
      }
    }
  };
  const reservado = (x, y) => (x < 8 && y < 8) || (x > lado - 9 && y < 8) || (x < 8 && y > lado - 9);
  function pintar(x, y) {
    const r = document.createElementNS(ns, 'rect');
    r.setAttribute('x', x);
    r.setAttribute('y', y);
    r.setAttribute('width', 1);
    r.setAttribute('height', 1);
    desenho.appendChild(r);
  }
  quadro(0, 0);
  quadro(lado - 7, 0);
  quadro(0, lado - 7);
  let semente = 1207;
  for (let x = 0; x < lado; x += 1) {
    for (let y = 0; y < lado; y += 1) {
      semente = (semente * 9301 + 49297) % 233280;
      if (!reservado(x, y) && semente / 233280 > 0.52) pintar(x, y);
    }
  }
}

function iniciarRelogio() {
  clearInterval(relogio);
  let restante = 30 * 60;
  const mostrar = () => {
    tempo.textContent = String(Math.floor(restante / 60)).padStart(2, '0') + ':' + String(restante % 60).padStart(2, '0');
    tempo.setAttribute('datetime', 'PT' + restante + 'S');
  };
  mostrar();
  relogio = setInterval(() => {
    restante -= 1;
    mostrar();
    if (restante <= 0) {
      clearInterval(relogio);
      aguardando.hidden = true;
      vencido.hidden = false;
    }
  }, 1000);
}

let espera;
copiar.addEventListener('click', () => {
  if (navigator.clipboard) navigator.clipboard.writeText(codigo.textContent).catch(() => {});
  clearTimeout(espera);
  copiar.classList.add('copiado');
  copiar.textContent = 'Código copiado!';
  espera = setTimeout(() => {
    copiar.classList.remove('copiado');
    copiar.textContent = 'Copiar código';
  }, 2000);
});

raiz.querySelector('.jaPaguei').addEventListener('click', () => {
  clearInterval(relogio);
  aguardando.hidden = true;
  pago.hidden = false;
  pago.focus({ preventScroll: reduzir });
});

raiz.querySelector('.novo').addEventListener('click', () => {
  vencido.hidden = true;
  aguardando.hidden = false;
  iniciarRelogio();
});

desenharQr();
iniciarRelogio();
