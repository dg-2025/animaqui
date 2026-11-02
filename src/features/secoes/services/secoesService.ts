import 'server-only';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { AppError } from '@/shared/utils/errors';
import { classeDaSecao } from '@/shared/utils/montarDocumento';
import type { CategoriaDTO, SecaoDTO, VariacaoResumoDTO } from '../types';

const PASTA_BANCO = path.join(process.cwd(), 'banco-de-dados');
const PASTA_SECOES = path.join(PASTA_BANCO, 'secoes');

const CategoriasSchema = z.array(z.object({ id: z.string().min(1), nome: z.string().min(1) }));

const MetaSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  categoria: z.string().min(1),
  descricao: z.string().min(1),
});

async function lerJson(arquivo: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(arquivo, 'utf-8'));
  } catch {
    throw new Error(`banco-de-dados: JSON inválido em ${arquivo}`);
  }
}

// Sem isso, o CSS de uma seção vaza para as outras quando o Montador junta tudo.
function validarEscopoDoCss(css: string, classe: string, arquivo: string): void {
  const limpo = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let profundidade = 0;
  let cabecalho = '';

  for (const caractere of limpo) {
    if (caractere === '{') {
      const seletor = cabecalho.trim();
      if (profundidade === 0 && !seletor.startsWith(`.${classe}`) && !seletor.startsWith(`@keyframes ${classe}`)) {
        throw new Error(`banco-de-dados: em ${arquivo}, a regra "${seletor}" precisa ficar dentro de .${classe}`);
      }
      profundidade += 1;
      cabecalho = '';
    } else if (caractere === '}') {
      profundidade -= 1;
      cabecalho = '';
    } else if (caractere === ';') {
      cabecalho = '';
    } else {
      cabecalho += caractere;
    }
  }
}

async function lerResumo(categoria: string, pasta: string): Promise<VariacaoResumoDTO> {
  const arquivo = path.join(PASTA_SECOES, categoria, pasta, 'meta.json');
  const meta = MetaSchema.safeParse(await lerJson(arquivo));
  if (!meta.success) throw new Error(`banco-de-dados: ${arquivo} incompleto: ${meta.error.message}`);
  if (meta.data.id !== pasta || meta.data.categoria !== categoria) {
    throw new Error(`banco-de-dados: em ${arquivo}, id e categoria precisam ser iguais aos nomes das pastas`);
  }
  return meta.data;
}

export async function listarCategoriasService(): Promise<CategoriaDTO[]> {
  'use cache';
  const arquivo = path.join(PASTA_SECOES, 'categorias.json');
  const categorias = CategoriasSchema.safeParse(await lerJson(arquivo));
  if (!categorias.success) throw new Error(`banco-de-dados: ${arquivo} inválido`);

  return Promise.all(categorias.data.map(async ({ id, nome }) => {
    const pastas = await readdir(path.join(PASTA_SECOES, id), { withFileTypes: true });
    const nomes = pastas.filter((item) => item.isDirectory()).map((item) => item.name).sort();
    const variacoes = await Promise.all(nomes.map((pasta) => lerResumo(id, pasta)));
    return { id, nome, quantidade: variacoes.length, variacoes };
  }));
}

async function lerSecao(categoria: string, variacao: string): Promise<SecaoDTO | null> {
  'use cache';
  const categorias = await listarCategoriasService();
  const resumo = categorias
    .find((item) => item.id === categoria)
    ?.variacoes.find((item) => item.id === variacao);
  if (!resumo) return null;

  const pasta = path.join(PASTA_SECOES, categoria, variacao);
  const [html, css, js] = await Promise.all([
    readFile(path.join(pasta, 'secao.html'), 'utf-8'),
    readFile(path.join(pasta, 'estilo.css'), 'utf-8'),
    readFile(path.join(pasta, 'script.js'), 'utf-8').catch(() => ''),
  ]);

  if (!html.trim()) throw new Error(`banco-de-dados: ${pasta}/secao.html está vazio`);
  validarEscopoDoCss(css, classeDaSecao(variacao), `${pasta}/estilo.css`);

  return { ...resumo, html, css, js };
}

export async function obterSecaoService(categoria: string, variacao: string): Promise<SecaoDTO> {
  const secao = await lerSecao(categoria, variacao);
  if (!secao) throw new AppError('Seção não encontrada.', 404);
  return secao;
}

export async function obterTemaService(): Promise<string> {
  'use cache';
  return readFile(path.join(PASTA_BANCO, 'tema-padrao.css'), 'utf-8');
}
