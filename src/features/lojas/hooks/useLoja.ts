import { useMemo, useState } from 'react';
import { useSecoes } from '@/features/secoes/hooks/useSecoes';
import type { EntradaDocumento } from '@/shared/utils/montarDocumento';
import type { LojaDTO } from '../types';

export function useLoja(loja: LojaDTO, tema: string) {
  const [paginaInicial, setPaginaInicial] = useState(loja.paginas[0].id);
  const referencias = useMemo(() => loja.paginas.flatMap((pagina) => pagina.secoes), [loja]);
  const { secoesPorId } = useSecoes(referencias);

  const estaCompleto = referencias.every((referencia) => secoesPorId.has(referencia.id));

  // Só monta quando todas as seções chegaram: uma loja pela metade quebraria a navegação.
  const entrada = useMemo<EntradaDocumento | null>(() => {
    if (!estaCompleto) return null;
    return {
      tema,
      secoes: [loja.navegacao],
      paginas: loja.paginas.map((pagina) => ({
        id: pagina.id,
        secoes: pagina.secoes.flatMap((referencia) => secoesPorId.get(referencia.id) ?? []),
      })),
      paginaInicial,
    };
  }, [estaCompleto, tema, loja, secoesPorId, paginaInicial]);

  return { entrada, estaCompleto, paginaInicial, setPaginaInicial };
}
