import { obterSecaoService } from '@/features/secoes/services/secoesService';
import { apiHandler } from '@/shared/lib/apiHandler';

interface Contexto {
  params: Promise<{ categoria: string; variacao: string }>;
}

export const GET = apiHandler(async ({ params }: Contexto) => {
  const { categoria, variacao } = await params;
  return obterSecaoService(categoria, variacao);
});
