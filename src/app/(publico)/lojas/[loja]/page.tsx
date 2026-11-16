import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listarLojasService, obterLojaService } from '@/features/lojas/services/lojasService';
import { obterTemaService } from '@/features/secoes/services/secoesService';
import { metadadosDaPagina } from '@/shared/lib/site';
import { AppError } from '@/shared/utils/errors';
import LojasView from '@/views/client/Lojas';

type Params = Promise<{ loja: string }>;

// Toda loja sai pronta do build, como as variações do catálogo (D-15).
export const instant = false;

export async function generateStaticParams() {
  const lojas = await listarLojasService();
  return lojas.map((loja) => ({ loja: loja.id }));
}

async function buscarLoja(params: Params) {
  const { loja } = await params;
  try {
    return await obterLojaService(loja);
  } catch (erro) {
    if (erro instanceof AppError && erro.status === 404) notFound();
    throw erro;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const loja = await buscarLoja(params);
  return metadadosDaPagina({
    titulo: `Loja pronta: ${loja.nome}`,
    descricao: loja.descricao,
    caminho: `/lojas/${loja.id}`,
  });
}

export default async function LojaPage({ params }: { params: Params }) {
  const [loja, lojas, tema] = await Promise.all([buscarLoja(params), listarLojasService(), obterTemaService()]);
  return <LojasView key={loja.id} loja={loja} lojas={lojas} tema={tema} />;
}
