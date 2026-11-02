import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import { AppError } from '@/shared/utils/errors';

// O conteúdo só muda com uma nova publicação: a CDN responde, sem acordar a função.
const CACHE_DE_CONTEUDO = 'public, s-maxage=86400, stale-while-revalidate=604800';

export function apiHandler<Contexto>(manipulador: (contexto: Contexto) => Promise<unknown>) {
  return async (_request: Request, contexto: Contexto): Promise<Response> => {
    try {
      return Response.json(await manipulador(contexto), { headers: { 'Cache-Control': CACHE_DE_CONTEUDO } });
    } catch (erro) {
      unstable_rethrow(erro);
      if (erro instanceof AppError) {
        return Response.json({ sucesso: false, erro: erro.message }, { status: erro.status });
      }
      console.error(erro);
      return Response.json({ sucesso: false, erro: 'Erro interno' }, { status: 500 });
    }
  };
}
