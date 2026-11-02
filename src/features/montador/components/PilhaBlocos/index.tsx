"use client";

import { useState } from 'react';
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from 'lucide-react';
import PainelSecao from '@/shared/ui/PainelSecao';
import type { BlocoDaPilha } from '../../types';
import styles from './style.module.css';

interface PilhaBlocosProps {
  pilha: BlocoDaPilha[];
  aoMover: (origem: number, destino: number) => void;
  aoRemover: (chave: string) => void;
}

export default function PilhaBlocos({ pilha, aoMover, aoRemover }: PilhaBlocosProps) {
  const [arrastando, setArrastando] = useState<number | null>(null);
  const [sobre, setSobre] = useState<number | null>(null);

  const terminar = () => {
    setArrastando(null);
    setSobre(null);
  };

  return (
    <PainelSecao titulo={`Sua página (${pilha.length})`}>
      {pilha.length === 0 && <p className={styles.vazio}>Os blocos que você escolher aparecem aqui, nesta ordem.</p>}

      <ol className={styles.lista}>
        {pilha.map(({ chave, nome }, indice) => (
          <li
            key={chave}
            draggable
            className={`${styles.bloco} ${arrastando === indice ? styles.blocoArrastando : ''} ${sobre === indice ? styles.blocoSobre : ''}`}
            onDragStart={() => setArrastando(indice)}
            onDragOver={(evento) => {
              evento.preventDefault();
              setSobre(indice);
            }}
            onDrop={(evento) => {
              evento.preventDefault();
              if (arrastando !== null) aoMover(arrastando, indice);
              terminar();
            }}
            onDragEnd={terminar}
          >
            <GripVertical size={18} aria-hidden="true" className={styles.alca} />
            <span className={styles.nome}>{nome}</span>
            <button
              type="button"
              className={styles.acao}
              aria-label={`Subir ${nome}`}
              disabled={indice === 0}
              onClick={() => aoMover(indice, indice - 1)}
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.acao}
              aria-label={`Descer ${nome}`}
              disabled={indice === pilha.length - 1}
              onClick={() => aoMover(indice, indice + 1)}
            >
              <ArrowDown size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.acao}
              aria-label={`Remover ${nome}`}
              onClick={() => aoRemover(chave)}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </PainelSecao>
  );
}
