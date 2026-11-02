import 'server-only';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { AppError } from '@/shared/utils/errors';
import type { AnimacaoDTO, AnimacaoResumoDTO, TipoAnimacao } from '../types';

const PASTA_ANIMACOES = path.join(process.cwd(), 'banco-de-dados', 'animacoes');
const TIPOS: TipoAnimacao[] = ['secao', 'texto'];

const MetaSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  tipo: z.enum(['secao', 'texto']),
  descricao: z.string().min(1),
  precisaRolar: z.boolean(),
});

export async function listarAnimacoesService(tipo: TipoAnimacao): Promise<AnimacaoResumoDTO[]> {
  'use cache';
  const pastas = await readdir(path.join(PASTA_ANIMACOES, tipo), { withFileTypes: true });
  const nomes = pastas.filter((item) => item.isDirectory()).map((item) => item.name).sort();

  return Promise.all(nomes.map(async (pasta) => {
    const arquivo = path.join(PASTA_ANIMACOES, tipo, pasta, 'meta.json');
    const meta = MetaSchema.safeParse(JSON.parse(await readFile(arquivo, 'utf-8')));
    if (!meta.success) throw new Error(`banco-de-dados: ${arquivo} incompleto: ${meta.error.message}`);
    if (meta.data.id !== pasta || meta.data.tipo !== tipo) {
      throw new Error(`banco-de-dados: em ${arquivo}, id e tipo precisam ser iguais aos nomes das pastas`);
    }
    return meta.data;
  }));
}

async function lerAnimacao(tipo: string, id: string): Promise<AnimacaoDTO | null> {
  'use cache';
  if (!TIPOS.includes(tipo as TipoAnimacao)) return null;
  const lista = await listarAnimacoesService(tipo as TipoAnimacao);
  const resumo = lista.find((item) => item.id === id);
  if (!resumo) return null;

  const pasta = path.join(PASTA_ANIMACOES, tipo, id);
  const [css, js] = await Promise.all([
    readFile(path.join(pasta, 'estilo.css'), 'utf-8'),
    readFile(path.join(pasta, 'script.js'), 'utf-8').catch(() => ''),
  ]);

  return { ...resumo, css, js };
}

export async function obterAnimacaoService(tipo: string, id: string): Promise<AnimacaoDTO> {
  const animacao = await lerAnimacao(tipo, id);
  if (!animacao) throw new AppError('Animação não encontrada.', 404);
  return animacao;
}
