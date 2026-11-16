import 'server-only';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { listarCategoriasService, validarEscopoDoCss } from '@/features/secoes/services/secoesService';
import { AppError } from '@/shared/utils/errors';
import { classeDaSecao, escaparTexto } from '@/shared/utils/montarDocumento';
import type { LojaDTO, LojaResumoDTO, NavegacaoDTO } from '../types';

const PASTA_LOJAS = path.join(process.cwd(), 'banco-de-dados', 'lojas');
const PASTA_NAVEGACAO = 'navegacao';
const ID_NAVEGACAO = 'navegacao-loja';

const LojaSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  segmento: z.string().min(1),
  descricao: z.string().min(1),
  paginas: z.array(z.object({
    id: z.string().regex(/^[\w-]+$/),
    nome: z.string().min(1),
    secoes: z.array(z.string().regex(/^[\w-]+\/[\w-]+$/)).min(1),
  })).min(1),
});

type LojaArquivo = z.infer<typeof LojaSchema>;

async function lerLoja(pasta: string): Promise<LojaArquivo> {
  const arquivo = path.join(PASTA_LOJAS, pasta, 'loja.json');
  let dados: unknown;
  try {
    dados = JSON.parse(await readFile(arquivo, 'utf-8'));
  } catch {
    throw new Error(`banco-de-dados: JSON inválido em ${arquivo}`);
  }
  const loja = LojaSchema.safeParse(dados);
  if (!loja.success) throw new Error(`banco-de-dados: ${arquivo} incompleto: ${loja.error.message}`);
  if (loja.data.id !== pasta) throw new Error(`banco-de-dados: em ${arquivo}, o id precisa ser igual ao nome da pasta`);
  return loja.data;
}

// Toda loja aponta para seções que existem: senão o build para citando o arquivo (RN-200).
async function lerTodas(): Promise<LojaArquivo[]> {
  'use cache';
  const [pastas, categorias] = await Promise.all([
    readdir(PASTA_LOJAS, { withFileTypes: true }),
    listarCategoriasService(),
  ]);
  const existentes = new Set(categorias.flatMap((categoria) => categoria.variacoes.map((variacao) => `${categoria.id}/${variacao.id}`)));
  const nomes = pastas.filter((item) => item.isDirectory() && item.name !== PASTA_NAVEGACAO).map((item) => item.name).sort();
  const lojas = await Promise.all(nomes.map(lerLoja));

  lojas.forEach((loja) => loja.paginas.forEach((pagina) => pagina.secoes.forEach((secao) => {
    if (!existentes.has(secao)) {
      throw new Error(`banco-de-dados: em lojas/${loja.id}/loja.json, a seção "${secao}" não existe`);
    }
  })));
  return lojas;
}

export async function listarLojasService(): Promise<LojaResumoDTO[]> {
  const lojas = await lerTodas();
  return lojas.map(({ id, nome, segmento, descricao }) => ({ id, nome, segmento, descricao }));
}

async function lerNavegacao(): Promise<NavegacaoDTO> {
  'use cache';
  const pasta = path.join(PASTA_LOJAS, PASTA_NAVEGACAO);
  const [html, css, js] = await Promise.all([
    readFile(path.join(pasta, 'secao.html'), 'utf-8'),
    readFile(path.join(pasta, 'estilo.css'), 'utf-8'),
    readFile(path.join(pasta, 'script.js'), 'utf-8'),
  ]);
  validarEscopoDoCss(css, classeDaSecao(ID_NAVEGACAO), `${pasta}/estilo.css`);
  return { id: ID_NAVEGACAO, html, css, js };
}

// Preenche a barra com o nome e as páginas da loja; todo texto vindo do arquivo sai escapado.
function preencherNavegacao(navegacao: NavegacaoDTO, loja: LojaArquivo): NavegacaoDTO {
  const links = loja.paginas
    .map((pagina) => `      <a class="link" href="#/${escaparTexto(pagina.id)}" data-ir="${escaparTexto(pagina.id)}">${escaparTexto(pagina.nome)}</a>`)
    .join('\n');
  const html = navegacao.html
    .replaceAll('{{nome}}', escaparTexto(loja.nome))
    .replaceAll('{{primeira}}', escaparTexto(loja.paginas[0].id))
    .replace('{{links}}', links);
  return { ...navegacao, html };
}

export async function obterLojaService(id: string): Promise<LojaDTO> {
  const [lojas, navegacao] = await Promise.all([lerTodas(), lerNavegacao()]);
  const loja = lojas.find((item) => item.id === id);
  if (!loja) throw new AppError('Loja não encontrada.', 404);

  return {
    id: loja.id,
    nome: loja.nome,
    segmento: loja.segmento,
    descricao: loja.descricao,
    paginas: loja.paginas.map((pagina) => ({
      id: pagina.id,
      nome: pagina.nome,
      secoes: pagina.secoes.map((caminho) => {
        const [categoria, secao] = caminho.split('/');
        return { categoria, id: secao };
      }),
    })),
    navegacao: preencherNavegacao(navegacao, loja),
  };
}
