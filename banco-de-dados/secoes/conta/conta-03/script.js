// Conta só visual: nada sai do navegador
const vistaConta = raiz.querySelector('.vistaConta');
const vistaEntrar = raiz.querySelector('.vistaEntrar');
const formPerfil = raiz.querySelector('.formPerfil');
const formSenha = raiz.querySelector('.formSenha');
const formEntrar = raiz.querySelector('.cartaoEntrar');
const primeiroNome = raiz.querySelector('.primeiroNome');
const forcaBarra = raiz.querySelector('.forcaBarra');
const alertaErro = raiz.querySelector('.alertaErro');
let criando = false;

function mensagem(formulario, texto, certo) {
  const caixa = formulario.querySelector('.mensagem');
  caixa.hidden = false;
  caixa.textContent = texto;
  caixa.classList.toggle('certo', certo);
  caixa.classList.toggle('errado', !certo);
}

function invalido(formulario, nome) {
  formulario.querySelectorAll('[aria-invalid]').forEach((entrada) => entrada.removeAttribute('aria-invalid'));
  if (!nome) return;
  formulario.elements[nome].setAttribute('aria-invalid', 'true');
  formulario.elements[nome].focus();
}

// Botão mostra "Salvando..." por um instante, como se fosse ao servidor
function simular(botao, textoEspera, depois) {
  const antes = botao.textContent;
  botao.disabled = true;
  botao.textContent = textoEspera;
  setTimeout(() => {
    botao.disabled = false;
    botao.textContent = antes;
    depois();
  }, 700);
}

const celular = formPerfil.elements.celular;
celular.addEventListener('input', () => {
  const d = celular.value.replace(/\D/g, '').slice(0, 11);
  celular.value = d.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
});

formPerfil.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const nome = formPerfil.elements.nome.value.trim();
  if (nome.length < 3) {
    invalido(formPerfil, 'nome');
    return mensagem(formPerfil, 'Digite seu nome completo.', false);
  }
  invalido(formPerfil);
  simular(formPerfil.querySelector('.botaoSalvar'), 'Salvando...', () => {
    primeiroNome.textContent = nome.split(' ')[0];
    mensagem(formPerfil, 'Dados atualizados com sucesso!', true);
  });
});

// Força da senha: tamanho, número e letra maiúscula
formSenha.elements.nova.addEventListener('input', () => {
  const senha = formSenha.elements.nova.value;
  const pontos = [senha.length >= 6, senha.length >= 10, /\d/.test(senha), /[A-Z]/.test(senha)].filter(Boolean).length;
  const cores = ['var(--vermelho)', 'var(--vermelho)', 'var(--cor-alerta)', 'var(--azul)', 'var(--verde)'];
  forcaBarra.style.setProperty('--nivel', (pontos / 4) * 100 + '%');
  forcaBarra.style.setProperty('--corForca', cores[pontos]);
});

formSenha.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const { atual, nova, confirmar } = formSenha.elements;
  if (!atual.value) { invalido(formSenha, 'atual'); return mensagem(formSenha, 'Digite sua senha atual.', false); }
  if (nova.value.length < 6) { invalido(formSenha, 'nova'); return mensagem(formSenha, 'A nova senha deve ter pelo menos 6 caracteres.', false); }
  if (nova.value !== confirmar.value) { invalido(formSenha, 'confirmar'); return mensagem(formSenha, 'As senhas não coincidem.', false); }
  invalido(formSenha);
  simular(formSenha.querySelector('.botaoSenha'), 'Alterando...', () => {
    formSenha.reset();
    forcaBarra.style.setProperty('--nivel', '0%');
    mensagem(formSenha, 'Senha alterada com sucesso!', true);
  });
});

function trocarVista(entrar) {
  vistaConta.hidden = entrar;
  vistaEntrar.hidden = !entrar;
  (entrar ? formEntrar.elements.email : raiz.querySelector('.voltar')).focus();
}

raiz.querySelector('.sair').addEventListener('click', () => trocarVista(true));

raiz.querySelector('.trocarModo').addEventListener('click', () => {
  criando = !criando;
  raiz.querySelector('.tituloEntrar').textContent = criando ? 'Criar conta' : 'Entrar';
  raiz.querySelector('.botaoEntrar').textContent = criando ? 'Criar conta' : 'Entrar';
  raiz.querySelector('.perguntaTroca').textContent = criando ? 'Já tem conta?' : 'Ainda não tem conta?';
  raiz.querySelector('.trocarModo').textContent = criando ? 'Entrar' : 'Criar conta';
  raiz.querySelector('.campoNome').hidden = !criando;
  alertaErro.hidden = true;
});

formEntrar.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const { nome, email, senha } = formEntrar.elements;
  let problema = '';
  if (criando && nome.value.trim().length < 3) problema = 'nome';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) problema = 'email';
  else if (senha.value.length < 6) problema = 'senha';
  if (problema) {
    invalido(formEntrar, problema);
    alertaErro.hidden = false;
    alertaErro.textContent = { nome: 'Digite seu nome.', email: 'Digite um e-mail válido.', senha: 'A senha tem pelo menos 6 caracteres.' }[problema];
    return;
  }
  invalido(formEntrar);
  alertaErro.hidden = true;
  simular(formEntrar.querySelector('.botaoEntrar'), criando ? 'Criando...' : 'Entrando...', () => {
    if (criando) {
      formPerfil.elements.nome.value = nome.value.trim();
      primeiroNome.textContent = nome.value.trim().split(' ')[0];
    }
    formPerfil.elements.email.value = email.value;
    formEntrar.reset();
    trocarVista(false);
  });
});
