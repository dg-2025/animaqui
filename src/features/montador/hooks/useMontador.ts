import { useCallback, useMemo, useRef, useState } from 'react';
import { useAnimacoes } from '@/features/animacoes/hooks/useAnimacoes';
import { useSecoes } from '@/features/secoes/hooks/useSecoes';
import type { VariacaoResumoDTO } from '@/features/secoes/types';
import type { EntradaDocumento } from '@/shared/utils/montarDocumento';
import type { BlocoDaPilha } from '../types';

export function useMontador(tema: string) {
  const [pilha, setPilha] = useState<BlocoDaPilha[]>([]);
  const [animacaoId, setAnimacaoId] = useState<string | null>('entrada');
  const proximaChave = useRef(0);

  const { secoesPorId } = useSecoes(pilha);
  const { animacao } = useAnimacoes('secao', animacaoId);

  const adicionar = useCallback((variacoes: VariacaoResumoDTO[]) => {
    const novos = variacoes.map(({ categoria, id, nome }) => {
      proximaChave.current += 1;
      return { chave: `${id}-${proximaChave.current}`, categoria, id, nome };
    });
    setPilha((atual) => [...atual, ...novos]);
  }, []);

  const remover = useCallback((chave: string) => {
    setPilha((atual) => atual.filter((bloco) => bloco.chave !== chave));
  }, []);

  const mover = useCallback((origem: number, destino: number) => {
    setPilha((atual) => {
      if (destino < 0 || destino >= atual.length) return atual;
      const copia = [...atual];
      const [bloco] = copia.splice(origem, 1);
      copia.splice(destino, 0, bloco);
      return copia;
    });
  }, []);

  const entrada = useMemo<EntradaDocumento | null>(() => {
    const secoes = pilha.flatMap((bloco) => secoesPorId.get(bloco.id) ?? []);
    if (secoes.length === 0) return null;
    return { tema, secoes, animacao };
  }, [pilha, secoesPorId, tema, animacao]);

  const estaCompleto = entrada !== null && entrada.secoes.length === pilha.length;

  return { pilha, adicionar, remover, mover, animacaoId, setAnimacaoId, entrada, estaCompleto };
}
