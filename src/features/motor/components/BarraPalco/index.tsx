"use client";

import { useState, type CSSProperties, type ReactNode } from 'react';
import { Monitor, RotateCcw, Smartphone } from 'lucide-react';
import type { Dispositivo } from '../../types';
import styles from './style.module.css';

const DISPOSITIVOS = [
  { id: 'computador', rotulo: 'Computador', Icone: Monitor },
  { id: 'celular', rotulo: 'Celular', Icone: Smartphone },
] as const;

interface BarraPalcoProps {
  dispositivo: Dispositivo;
  aoTrocarDispositivo: (dispositivo: Dispositivo) => void;
  aoRepetir: () => void;
  acaoPrincipal: ReactNode;
}

export default function BarraPalco({ dispositivo, aoTrocarDispositivo, aoRepetir, acaoPrincipal }: BarraPalcoProps) {
  const [giros, setGiros] = useState(0);
  const indice = DISPOSITIVOS.findIndex(({ id }) => id === dispositivo);

  return (
    <div className={styles.barra}>
      <div className={styles.dispositivos} role="group" aria-label="Tamanho da tela">
        <span className={styles.indicador} style={{ '--indice': indice } as CSSProperties} aria-hidden="true" />
        {DISPOSITIVOS.map(({ id, rotulo, Icone }) => (
          <button
            key={id}
            type="button"
            className={styles.dispositivo}
            aria-label={rotulo}
            aria-pressed={id === dispositivo}
            title={rotulo}
            onClick={() => aoTrocarDispositivo(id)}
          >
            <Icone size={20} aria-hidden="true" />
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.repetir}
        aria-label="Repetir a animação"
        onClick={() => {
          setGiros((atual) => atual + 1);
          aoRepetir();
        }}
      >
        <RotateCcw
          size={18}
          aria-hidden="true"
          className={styles.iconeRepetir}
          style={{ '--giros': giros } as CSSProperties}
        />
        <span className={styles.repetirTexto}>Repetir</span>
      </button>

      <div className={styles.acaoPrincipal}>{acaoPrincipal}</div>
    </div>
  );
}
