import useSWR from 'swr';
import { httpClient } from '@/shared/lib/httpClient';
import type { SecaoDTO } from '../types';

export interface ReferenciaSecao {
  categoria: string;
  id: string;
}

const baixadas = new Map<string, Promise<SecaoDTO>>();

export function adiantarSecao({ categoria, id }: ReferenciaSecao): Promise<SecaoDTO> {
  const caminho = `${categoria}/${id}`;
  let pedido = baixadas.get(caminho);
  if (!pedido) {
    pedido = httpClient<SecaoDTO>(`/api/secoes/${caminho}`);
    pedido.catch(() => baixadas.delete(caminho));
    baixadas.set(caminho, pedido);
  }
  return pedido;
}

export function useSecoes(referencias: ReferenciaSecao[]) {
  const unicas = [...new Set(referencias.map(({ categoria, id }) => `${categoria}/${id}`))].sort();

  const { data, isLoading } = useSWR(
    unicas.length > 0 ? ['secoes', ...unicas] : null,
    async () => {
      const secoes = await Promise.all(unicas.map((caminho) => {
        const [categoria, id] = caminho.split('/');
        return adiantarSecao({ categoria, id });
      }));
      return new Map(secoes.map((secao) => [secao.id, secao]));
    },
    { keepPreviousData: true, revalidateOnFocus: false, revalidateIfStale: false },
  );

  return { secoesPorId: data ?? new Map<string, SecaoDTO>(), estaCarregando: isLoading };
}
