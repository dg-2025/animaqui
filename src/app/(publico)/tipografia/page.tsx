import { listarAnimacoesService } from '@/features/animacoes/services/animacoesService';
import { obterTemaService } from '@/features/secoes/services/secoesService';
import { metadadosDaPagina } from '@/shared/lib/site';
import TipografiaView from '@/views/client/Tipografia';

export const metadata = metadadosDaPagina({
  titulo: 'Tipografia',
  descricao: 'Digite uma frase, troque a fonte e veja o texto ganhar vida.',
  caminho: '/tipografia',
});

export default async function TipografiaPage() {
  const [animacoes, tema] = await Promise.all([listarAnimacoesService('texto'), obterTemaService()]);
  return <TipografiaView animacoes={animacoes} tema={tema} />;
}
