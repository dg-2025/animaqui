const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const alternar = raiz.querySelector('.alternar');
const opcoes = [...raiz.querySelectorAll('.opcaoModo')];
const paineis = [...raiz.querySelectorAll('.painel')];
const titulo = raiz.querySelector('.titulo');
const subtitulo = raiz.querySelector('.subtitulo');
const rodape = raiz.querySelector('.rodape');
const rodapeTexto = raiz.querySelector('.rodapeTexto');
const trocar = raiz.querySelector('.trocar');
const sucesso = raiz.querySelector('.sucesso');
const cabecalho = raiz.querySelector('.cabecalho');
const textos = {
  entrar: { titulo: 'Acesse sua conta', subtitulo: 'Bom ver você de novo', rodape: 'Ainda não tem conta?', trocar: 'Cadastre-se aqui' },
  criar: { titulo: 'Crie sua conta', subtitulo: 'Leva menos de um minuto', rodape: 'Já tem conta?', trocar: 'Entre aqui' },
};
let modo = 'entrar';
const emailValido = (texto) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto.trim());

// Troca entre entrar e criar conta: o marcador dourado desliza para o lado escolhido
function mudar(novo) {
  modo = novo;
  alternar.classList.toggle('criar', modo === 'criar');
  opcoes.forEach((opcao) => opcao.setAttribute('aria-pressed', String(opcao.dataset.modo === modo)));
  paineis.forEach((painel) => { painel.hidden = painel.dataset.modo !== modo; });
  titulo.textContent = textos[modo].titulo;
  subtitulo.textContent = textos[modo].subtitulo;
  rodapeTexto.textContent = textos[modo].rodape;
  trocar.textContent = textos[modo].trocar;
  raiz.querySelectorAll('.mensagem').forEach((mensagem) => { mensagem.textContent = ''; mensagem.className = 'mensagem'; });
}

opcoes.forEach((opcao) => opcao.addEventListener('click', () => mudar(opcao.dataset.modo)));
trocar.addEventListener('click', () => mudar(modo === 'entrar' ? 'criar' : 'entrar'));

// Mostrar ou esconder a senha
raiz.querySelectorAll('.mostrar').forEach((botao) => {
  botao.addEventListener('click', (evento) => {
    evento.preventDefault();
    const campo = botao.parentElement.querySelector('input');
    const mostrando = campo.type === 'password';
    campo.type = mostrando ? 'text' : 'password';
    botao.setAttribute('aria-pressed', String(mostrando));
    botao.setAttribute('aria-label', mostrando ? 'Esconder senha' : 'Mostrar senha');
  });
});

const criar = paineis[1];
const entrar = paineis[0];

// WhatsApp com máscara
const whatsapp = criar.elements.whatsapp;
whatsapp.addEventListener('input', () => {
  const d = whatsapp.value.replace(/\D/g, '').slice(0, 11);
  whatsapp.value = d.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
});

// Força da senha: tamanho, número e símbolo
const forca = criar.querySelector('.forca');
const forcaTexto = criar.querySelector('.forcaTexto');
function nivelSenha(senha) {
  if (!senha) return 0;
  let pontos = senha.length >= 8 ? 1 : 0;
  if (/\d/.test(senha) && /[a-z]/i.test(senha)) pontos += 1;
  if (/[^a-z0-9]/i.test(senha)) pontos += 1;
  return Math.max(1, pontos);
}
criar.elements.senha.addEventListener('input', () => {
  const nivel = nivelSenha(criar.elements.senha.value);
  forca.dataset.nivel = String(nivel);
  forcaTexto.textContent = ['Use letras, números e um símbolo', 'Senha fraca', 'Senha boa', 'Senha forte'][nivel];
});

raiz.querySelector('.esqueci').addEventListener('click', () => {
  const mensagem = entrar.querySelector('.mensagem');
  const email = entrar.elements.email.value;
  if (!emailValido(email)) {
    mensagem.className = 'mensagem erro';
    mensagem.textContent = 'Digite seu e-mail acima para receber o link.';
    entrar.elements.email.focus();
    return;
  }
  mensagem.className = 'mensagem ok';
  mensagem.textContent = 'Enviamos um link para ' + email.trim() + '. Confira também o spam.';
});

function falhar(formulario, campo, texto) {
  const mensagem = formulario.querySelector('.mensagem');
  mensagem.className = 'mensagem erro';
  mensagem.textContent = texto;
  campo.setAttribute('aria-invalid', 'true');
  campo.focus();
}

// Só visual: confere os campos e mostra a tela de boas-vindas
function concluir(formulario, nome) {
  const botao = formulario.querySelector('.enviar');
  const original = botao.textContent;
  botao.classList.add('enviando');
  botao.textContent = modo === 'entrar' ? 'Entrando...' : 'Criando...';
  setTimeout(() => {
    botao.classList.remove('enviando');
    botao.textContent = original;
    raiz.querySelector('.sucessoTitulo').textContent = nome ? 'Olá, ' + nome + '!' : 'Tudo certo!';
    raiz.querySelector('.sucessoTexto').textContent = modo === 'entrar' ? 'Você entrou na sua conta.' : 'Sua conta foi criada. Boas-vindas!';
    paineis.forEach((painel) => { painel.hidden = true; });
    alternar.hidden = true;
    cabecalho.hidden = true;
    rodape.hidden = true;
    sucesso.hidden = false;
    sucesso.focus();
  }, reduzir ? 0 : 800);
}

paineis.forEach((formulario) => {
  formulario.addEventListener('input', (evento) => {
    evento.target.removeAttribute('aria-invalid');
    const mensagem = formulario.querySelector('.mensagem');
    if (mensagem.classList.contains('erro')) { mensagem.textContent = ''; mensagem.className = 'mensagem'; }
  });
});

entrar.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const { email, senha } = entrar.elements;
  if (!emailValido(email.value)) return falhar(entrar, email, 'Confira o e-mail.');
  if (senha.value.length < 6) return falhar(entrar, senha, 'A senha tem pelo menos 6 caracteres.');
  const nome = email.value.split('@')[0].replace(/[._-]+/g, ' ').split(' ')[0];
  concluir(entrar, nome.charAt(0).toUpperCase() + nome.slice(1));
});

criar.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const { nome, email, senha, termos } = criar.elements;
  const whats = whatsapp.value.replace(/\D/g, '');
  if (nome.value.trim().split(/\s+/).length < 2) return falhar(criar, nome, 'Digite o nome e o sobrenome.');
  if (!emailValido(email.value)) return falhar(criar, email, 'Confira o e-mail.');
  if (whats.length < 10) return falhar(criar, whatsapp, 'Confira o WhatsApp com DDD.');
  if (senha.value.length < 8) return falhar(criar, senha, 'A senha precisa de pelo menos 8 caracteres.');
  if (!termos.checked) return falhar(criar, termos, 'Para criar a conta, aceite os termos.');
  concluir(criar, nome.value.trim().split(/\s+/)[0]);
});

raiz.querySelector('.sair').addEventListener('click', () => {
  paineis.forEach((painel) => painel.reset());
  forca.dataset.nivel = '0';
  alternar.hidden = false;
  cabecalho.hidden = false;
  rodape.hidden = false;
  sucesso.hidden = true;
  mudar('entrar');
  entrar.elements.email.focus();
});
