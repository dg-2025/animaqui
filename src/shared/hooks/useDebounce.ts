import { useEffect, useState } from 'react';

export function useDebounce<T>(valor: T, atraso: number): T {
  const [atrasado, setAtrasado] = useState(valor);

  useEffect(() => {
    const relogio = setTimeout(() => setAtrasado(valor), atraso);
    return () => clearTimeout(relogio);
  }, [valor, atraso]);

  return atrasado;
}
