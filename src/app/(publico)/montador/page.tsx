import { listarAnimacoesService } from '@/features/animacoes/services/animacoesService';
import { listarCategoriasService, obterTemaService } from '@/features/secoes/services/secoesService';
import { metadadosDaPagina } from '@/shared/lib/site';
import MontadorView from '@/views/client/Montador';

export const metadata = metadadosDaPagina({
  titulo: 'Montador',
  descricao: 'Empilhe blocos, veja a página completa e copie o site inteiro.',
  caminho: '/montador',
});

export default async function MontadorPage() {
  const [categorias, animacoes, tema] = await Promise.all([
    listarCategoriasService(),
    listarAnimacoesService('secao'),
    obterTemaService(),
  ]);
  return <MontadorView categorias={categorias} animacoes={animacoes} tema={tema} />;
}
