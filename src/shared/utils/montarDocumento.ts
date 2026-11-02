export interface PecaSecao {
  id: string;
  html: string;
  css: string;
  js: string;
}

export interface PecaAnimacao {
  id: string;
  css: string;
  js: string;
  precisaRolar: boolean;
}

export interface EntradaDocumento {
  tema: string;
  secoes: PecaSecao[];
  animacao?: PecaAnimacao | null;
  fontes?: string[];
}

export function classeDaSecao(id: string): string {
  return id.replace(/-/g, '');
}

export function escaparTexto(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function urlFonte(familia: string, texto?: string): string {
  const nome = encodeURIComponent(familia).replace(/%20/g, '+');
  const trecho = texto ? `&text=${encodeURIComponent(texto)}` : '';
  return `https://fonts.googleapis.com/css2?family=${nome}&display=swap${trecho}`;
}

function semRepetir(secoes: PecaSecao[]): PecaSecao[] {
  return secoes.filter((secao, indice) => secoes.findIndex((s) => s.id === secao.id) === indice);
}

// Leva só os tokens em uso, seguindo também os tokens citados por outros tokens.
function reduzirTema(tema: string, cssUsado: string): string {
  const bloco = tema.match(/:root\s*\{([\s\S]*?)\}/);
  if (!bloco) return tema;

  const declaracoes = new Map<string, string>();
  for (const [, nome, valor] of bloco[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    declaracoes.set(nome, valor.trim());
  }

  const restante = tema.replace(bloco[0], '').trim();
  const usados = new Set<string>();
  const pendentes = [`${cssUsado}\n${restante}`];

  while (pendentes.length > 0) {
    const trecho = pendentes.pop() ?? '';
    for (const [, nome] of trecho.matchAll(/var\(\s*(--[\w-]+)/g)) {
      const valor = declaracoes.get(nome);
      if (valor !== undefined && !usados.has(nome)) {
        usados.add(nome);
        pendentes.push(valor);
      }
    }
  }

  const tokens = [...declaracoes]
    .filter(([nome]) => usados.has(nome))
    .map(([nome, valor]) => `  ${nome}: ${valor};`)
    .join('\n');

  return `:root {\n${tokens}\n}\n\n${restante}`;
}

function montarEstilo(entrada: EntradaDocumento): string {
  const css = [
    ...semRepetir(entrada.secoes).map((secao) => secao.css.trim()),
    entrada.animacao?.css.trim() ?? '',
  ].filter(Boolean).join('\n\n');

  return `${reduzirTema(entrada.tema, css)}\n\n${css}`;
}

function montarScript(entrada: EntradaDocumento): string {
  const trechos = semRepetir(entrada.secoes)
    .filter((secao) => secao.js.trim())
    .map((secao) => `  document.querySelectorAll('.${classeDaSecao(secao.id)}').forEach(function (raiz) {\n${secao.js.trim()}\n  });`);

  if (entrada.animacao?.js.trim()) {
    trechos.push(`  document.querySelectorAll('[data-animacao="${entrada.animacao.id}"]').forEach(function (raiz) {\n${entrada.animacao.js.trim()}\n  });`);
  }

  return trechos.length > 0 ? `(function () {\n${trechos.join('\n')}\n})();` : '';
}

function montarCorpo(entrada: EntradaDocumento): string {
  const script = montarScript(entrada);
  const html = entrada.secoes
    .map((secao) => (entrada.animacao
      ? `<div data-animacao="${entrada.animacao.id}">\n${secao.html.trim()}\n</div>`
      : secao.html.trim()))
    .join('\n\n');

  return script ? `${html}\n\n<script>\n${script}\n</script>` : html;
}

function montarFontes(entrada: EntradaDocumento): string {
  return (entrada.fontes ?? [])
    .map((familia) => `<link rel="stylesheet" href="${escaparTexto(urlFonte(familia))}">`)
    .join('\n');
}

// Fonte única do que é copiado e do que aparece no palco.
export function montarDocumento(entrada: EntradaDocumento, formato: 'fragmento' | 'documento'): string {
  const fontes = montarFontes(entrada);
  const estilo = `<style>\n${montarEstilo(entrada)}\n</style>`;
  const corpo = montarCorpo(entrada);

  if (formato === 'fragmento') {
    return [fontes, estilo, corpo].filter(Boolean).join('\n\n');
  }

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Minha página</title>
${[fontes, estilo].filter(Boolean).join('\n')}
</head>
<body>
${corpo}
</body>
</html>`;
}

// O palco só acrescenta espaço para rolar quando o efeito depende da rolagem.
export function montarPalco(entrada: EntradaDocumento): string {
  const documento = montarDocumento(entrada, 'documento');
  if (!entrada.animacao?.precisaRolar) return documento;
  return documento.replace('</head>', '<style>body { padding-bottom: 120vh; }</style>\n</head>');
}
