import { obterAnimacaoService } from '@/features/animacoes/services/animacoesService';
import { apiHandler } from '@/shared/lib/apiHandler';

interface Contexto {
  params: Promise<{ tipo: string; id: string }>;
}

export const GET = apiHandler(async ({ params }: Contexto) => {
  const { tipo, id } = await params;
  return obterAnimacaoService(tipo, id);
});
