import type { MetadataRoute } from 'next';
import { listarCategoriasService } from '@/features/secoes/services/secoesService';
import { SITE } from '@/shared/lib/site';

// "/" e "/secoes" só redirecionam, então não entram.
const PAGINAS_FIXAS = ['/tipografia', '/montador', '/privacidade', '/termos'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categorias = await listarCategoriasService();
  const secoes = categorias.flatMap((categoria) =>
    categoria.variacoes.map((variacao) => `/secoes/${categoria.id}/${variacao.id}`),
  );
  return [...secoes, ...PAGINAS_FIXAS].map((caminho) => ({ url: `${SITE.url}${caminho}` }));
}
