import type { MetadataRoute } from 'next';
import { listarLojasService } from '@/features/lojas/services/lojasService';
import { listarCategoriasService } from '@/features/secoes/services/secoesService';
import { SITE } from '@/shared/lib/site';

// "/" e "/secoes" só redirecionam, então não entram.
const PAGINAS_FIXAS = ['/tipografia', '/montador', '/privacidade', '/termos'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categorias, lojas] = await Promise.all([listarCategoriasService(), listarLojasService()]);
  const secoes = categorias.flatMap((categoria) =>
    categoria.variacoes.map((variacao) => `/secoes/${categoria.id}/${variacao.id}`),
  );
  const paginasLojas = lojas.map((loja) => `/lojas/${loja.id}`);
  return [...secoes, ...paginasLojas, ...PAGINAS_FIXAS].map((caminho) => ({ url: `${SITE.url}${caminho}` }));
}
