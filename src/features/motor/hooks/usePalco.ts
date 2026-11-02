import { useCallback, useState } from 'react';
import { criarEstadoGlobal } from '@/shared/hooks/useEstadoGlobal';
import type { Dispositivo } from '../types';

const useDispositivo = criarEstadoGlobal<Dispositivo>('computador');

export function usePalco() {
  const [dispositivo, setDispositivo] = useDispositivo();
  const [repeticao, setRepeticao] = useState(0);

  const repetir = useCallback(() => setRepeticao((atual) => atual + 1), []);

  return { dispositivo, setDispositivo, repeticao, repetir };
}
