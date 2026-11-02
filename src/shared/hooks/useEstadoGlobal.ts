import { useSyncExternalStore } from 'react';

// Mantém a escolha da pessoa ao navegar entre variações, sem depender de recarregar a rota.
export function criarEstadoGlobal<T>(inicial: T) {
  let valor = inicial;
  const ouvintes = new Set<() => void>();

  const assinar = (ouvinte: () => void) => {
    ouvintes.add(ouvinte);
    return () => {
      ouvintes.delete(ouvinte);
    };
  };

  const definir = (novo: T) => {
    valor = novo;
    ouvintes.forEach((ouvinte) => ouvinte());
  };

  return function useEstadoGlobal() {
    const atual = useSyncExternalStore(assinar, () => valor, () => inicial);
    return [atual, definir] as const;
  };
}
