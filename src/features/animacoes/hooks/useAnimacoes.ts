import useSWR, { preload } from 'swr';
import { httpClient } from '@/shared/lib/httpClient';
import type { AnimacaoDTO, TipoAnimacao } from '../types';

const buscarAnimacao = (url: string) => httpClient<AnimacaoDTO>(url);
const urlAnimacao = (tipo: TipoAnimacao, id: string) => `/api/animacoes/${tipo}/${id}`;

export function adiantarAnimacao(tipo: TipoAnimacao, id: string) {
  preload(urlAnimacao(tipo, id), buscarAnimacao);
}

export function useAnimacoes(tipo: TipoAnimacao, id: string | null) {
  // Sem manter a anterior, o palco recarregaria duas vezes: sem animação e depois com a nova.
  const { data } = useSWR(id ? urlAnimacao(tipo, id) : null, buscarAnimacao, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return { animacao: id ? data ?? null : null };
}
