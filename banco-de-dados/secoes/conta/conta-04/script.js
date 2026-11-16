const abas = [...raiz.querySelectorAll('.aba')];
const paineis = [...raiz.querySelectorAll('.painel')];
const aviso = raiz.querySelector('.aviso');

// Ids únicos: o mesmo bloco pode aparecer duas vezes na página
const sufixo = Math.random().toString(36).slice(2, 7);
raiz.querySelectorAll('[id]').forEach((elemento) => { elemento.id += '-' + sufixo; });
raiz.querySelectorAll('[aria-controls]').forEach((elemento) => elemento.setAttribute('aria-controls', elemento.getAttribute('aria-controls') + '-' + sufixo));
raiz.querySelectorAll('[aria-labelledby]').forEach((elemento) => elemento.setAttribute('aria-labelledby', elemento.getAttribute('aria-labelledby') + '-' + sufixo));

let tempoAviso;
function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.hidden = false;
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(() => { aviso.hidden = true; }, 3000);
}

// Abas com teclado (setas, Home e End), como pede o padrão de abas
function abrirAba(aba, focar) {
  abas.forEach((outra) => {
    const ativa = outra === aba;
    outra.setAttribute('aria-selected', String(ativa));
    outra.tabIndex = ativa ? 0 : -1;
  });
  paineis.forEach((painel) => { painel.hidden = painel.id !== aba.getAttribute('aria-controls'); });
  if (focar) aba.focus();
}

abas.forEach((aba, i) => {
  aba.addEventListener('click', () => abrirAba(aba, false));
  aba.addEventListener('keydown', (evento) => {
    const mapa = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: abas.length - 1 };
    if (!(evento.key in mapa)) return;
    evento.preventDefault();
    abrirAba(abas[(mapa[evento.key] + abas.length) % abas.length], true);
  });
});

// Perfil: editar troca os textos por campos e salva de volta
const perfil = raiz.querySelector('.perfil');
const formEditar = raiz.querySelector('.formEditar');
const textos = { nome: '.perfilNome', telefone: '.perfilTelefone', email: '.perfilEmail' };

raiz.querySelector('.editar').addEventListener('click', () => {
  Object.entries(textos).forEach(([nome, seletor]) => { formEditar.elements[nome].value = raiz.querySelector(seletor).textContent; });
  perfil.hidden = true;
  formEditar.hidden = false;
  formEditar.elements.nome.focus();
});

function fecharEdicao() {
  formEditar.hidden = true;
  perfil.hidden = false;
}

formEditar.querySelector('.cancelar').addEventListener('click', fecharEdicao);
formEditar.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const vazio = Object.keys(textos).find((nome) => !formEditar.elements[nome].value.trim());
  if (vazio) {
    formEditar.elements[vazio].setAttribute('aria-invalid', 'true');
    formEditar.elements[vazio].focus();
    return;
  }
  Object.entries(textos).forEach(([nome, seletor]) => {
    formEditar.elements[nome].removeAttribute('aria-invalid');
    raiz.querySelector(seletor).textContent = formEditar.elements[nome].value.trim();
  });
  fecharEdicao();
  mostrarAviso('Dados salvos');
});

raiz.querySelector('.irEnderecos').addEventListener('click', () => abrirAba(abas[1], true));

// Endereços: adicionar, tornar principal e remover
const listaEnderecos = raiz.querySelector('.enderecos');
const formEndereco = raiz.querySelector('.formEndereco');
const botaoAdicionar = raiz.querySelector('.adicionar');
const semEndereco = raiz.querySelector('.semEndereco');
const modelo = listaEnderecos.querySelector('.endereco:not(.principal)');

function conferirLista() {
  const itens = [...listaEnderecos.children];
  if (itens.length && !itens.some((item) => item.classList.contains('principal'))) itens[0].classList.add('principal');
  semEndereco.hidden = itens.length > 0;
}

botaoAdicionar.addEventListener('click', () => {
  formEndereco.hidden = false;
  botaoAdicionar.hidden = true;
  formEndereco.elements.rua.focus();
});

function fecharEndereco() {
  formEndereco.reset();
  formEndereco.hidden = true;
  botaoAdicionar.hidden = false;
}

formEndereco.querySelector('.cancelar').addEventListener('click', fecharEndereco);
formEndereco.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const campos = formEndereco.elements;
  const faltando = ['rua', 'numero', 'bairro', 'cidade'].filter((nome) => !campos[nome].value.trim());
  ['rua', 'numero', 'bairro', 'cidade'].forEach((nome) => {
    if (faltando.includes(nome)) campos[nome].setAttribute('aria-invalid', 'true');
    else campos[nome].removeAttribute('aria-invalid');
  });
  if (faltando.length) {
    campos[faltando[0]].focus();
    return;
  }
  const novo = modelo.cloneNode(true);
  novo.classList.remove('principal');
  novo.classList.add('novo');
  const complemento = campos.complemento.value.trim();
  novo.querySelector('strong').textContent = 'Endereço ' + (listaEnderecos.children.length + 1);
  const linhas = novo.querySelectorAll('.enderecoInfo p');
  linhas[0].textContent = campos.rua.value.trim() + ', ' + campos.numero.value.trim() + (complemento ? ' · ' + complemento : '');
  linhas[1].textContent = campos.bairro.value.trim() + ' · ' + campos.cidade.value.trim();
  listaEnderecos.append(novo);
  fecharEndereco();
  conferirLista();
  mostrarAviso('Endereço salvo');
});

listaEnderecos.addEventListener('click', (evento) => {
  const item = evento.target.closest('.endereco');
  if (!item) return;
  if (evento.target.closest('.tornarPrincipal')) {
    listaEnderecos.querySelectorAll('.endereco').forEach((outro) => outro.classList.toggle('principal', outro === item));
    listaEnderecos.prepend(item);
    mostrarAviso('Endereço principal trocado');
  }
  if (evento.target.closest('.remover')) {
    item.remove();
    conferirLista();
  }
});

// Entrar ou criar conta: só a tela, sem login de verdade
const formEntrar = raiz.querySelector('.formEntrar');
const campoNome = raiz.querySelector('.campoNome');
const erro = formEntrar.querySelector('.erro');
const senha = formEntrar.elements.senha;
const verSenha = raiz.querySelector('.verSenha');
let criando = false;

verSenha.addEventListener('click', () => {
  const mostrar = senha.type === 'password';
  senha.type = mostrar ? 'text' : 'password';
  verSenha.setAttribute('aria-pressed', String(mostrar));
  verSenha.setAttribute('aria-label', mostrar ? 'Esconder senha' : 'Mostrar senha');
});

raiz.querySelector('.trocarBotao').addEventListener('click', (evento) => {
  criando = !criando;
  campoNome.hidden = !criando;
  raiz.querySelector('.entrarTitulo').textContent = criando ? 'Crie sua conta e ganhe 50 pontos' : 'Entre para juntar pontos';
  raiz.querySelector('.entrarBotao').textContent = criando ? 'Criar conta' : 'Entrar';
  raiz.querySelector('.trocarTexto').textContent = criando ? 'Já tem conta?' : 'Ainda não tem conta?';
  evento.currentTarget.textContent = criando ? 'Entrar' : 'Criar conta';
  senha.autocomplete = criando ? 'new-password' : 'current-password';
  erro.hidden = true;
});

formEntrar.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const usuario = formEntrar.elements.usuario;
  const nome = formEntrar.elements.nome;
  const invalidos = [];
  if (criando && !nome.value.trim()) invalidos.push(nome);
  if (!usuario.value.trim()) invalidos.push(usuario);
  if (senha.value.length < 6) invalidos.push(senha);
  [nome, usuario, senha].forEach((campo) => {
    if (invalidos.includes(campo)) campo.setAttribute('aria-invalid', 'true');
    else campo.removeAttribute('aria-invalid');
  });
  if (invalidos.length) {
    erro.hidden = false;
    invalidos[0].focus();
    return;
  }
  erro.hidden = true;
  if (criando) raiz.querySelector('.perfilNome').textContent = nome.value.trim();
  formEntrar.reset();
  abrirAba(abas[0], true);
  mostrarAviso(criando ? 'Conta criada. Você ganhou 50 pontos!' : 'Que bom ter você de volta!');
});

conferirLista();
