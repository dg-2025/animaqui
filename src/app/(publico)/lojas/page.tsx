import { notFound, redirect } from 'next/navigation';
import { listarLojasService } from '@/features/lojas/services/lojasService';

export default async function LojasPage() {
  const lojas = await listarLojasService();
  if (lojas.length === 0) notFound();
  redirect(`/lojas/${lojas[0].id}`);
}
