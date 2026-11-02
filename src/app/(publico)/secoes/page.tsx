import { notFound, redirect } from 'next/navigation';
import { listarCategoriasService } from '@/features/secoes/services/secoesService';

export default async function SecoesPage() {
  const categorias = await listarCategoriasService();
  const primeira = categorias.find((categoria) => categoria.variacoes.length > 0);
  if (!primeira) notFound();
  redirect(`/secoes/${primeira.id}/${primeira.variacoes[0].id}`);
}
