import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listarAnimacoesService } from '@/features/animacoes/services/animacoesService';
import {
  listarCategoriasService,
  obterSecaoService,
  obterTemaService,
} from '@/features/secoes/services/secoesService';
import { metadadosDaPagina } from '@/shared/lib/site';
import { AppError } from '@/shared/utils/errors';
import CatalogoView from '@/views/client/Catalogo';

type Params = Promise<{ categoria: string; variacao: string }>;

// Toda variação já sai pronta do build: trocar de tela sem placeholder é melhor que um esqueleto piscando.
export const instant = false;

export async function generateStaticParams() {
  const categorias = await listarCategoriasService();
  return categorias.flatMap((categoria) =>
    categoria.variacoes.map((variacao) => ({ categoria: categoria.id, variacao: variacao.id })),
  );
}

async function buscarSecao(params: Params) {
  const { categoria, variacao } = await params;
  try {
    return await obterSecaoService(categoria, variacao);
  } catch (erro) {
    if (erro instanceof AppError && erro.status === 404) notFound();
    throw erro;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const secao = await buscarSecao(params);
  return metadadosDaPagina({
    titulo: secao.nome,
    descricao: secao.descricao,
    caminho: `/secoes/${secao.categoria}/${secao.id}`,
  });
}

export default async function VariacaoPage({ params }: { params: Params }) {
  const [secao, categorias, animacoes, tema] = await Promise.all([
    buscarSecao(params),
    listarCategoriasService(),
    listarAnimacoesService('secao'),
    obterTemaService(),
  ]);

  return <CatalogoView secao={secao} categorias={categorias} animacoes={animacoes} tema={tema} />;
}
