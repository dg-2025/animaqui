"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { SlidersHorizontal, ListFilter, X } from 'lucide-react';
import styles from './style.module.css';

interface LayoutTresColunasProps {
  rotuloEsquerda: string;
  rotuloDireita: string;
  esquerda: ReactNode;
  centro: ReactNode;
  direita: ReactNode;
}

type Gaveta = 'esquerda' | 'direita' | null;

const TEMPO_ENTRADA = 1000;

export default function LayoutTresColunas({
  rotuloEsquerda,
  rotuloDireita,
  esquerda,
  centro,
  direita,
}: LayoutTresColunasProps) {
  const [gaveta, setGaveta] = useState<Gaveta>(null);

  // As entradas das colunas e listas só valem na chegada: trocar de variação recria a
  // página, e repetir tudo a cada clique cansa. Título e palco continuam animando.
  useEffect(() => {
    const relogio = setTimeout(() => {
      document.documentElement.dataset.jaEntrou = 'true';
    }, TEMPO_ENTRADA);
    return () => clearTimeout(relogio);
  }, []);

  useEffect(() => {
    if (!gaveta) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setGaveta(null);
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [gaveta]);

  // Escolher um item na gaveta devolve o palco à pessoa no celular.
  const aoClicarNaGaveta = (evento: MouseEvent<HTMLElement>) => {
    if ((evento.target as HTMLElement).closest('a, [data-fechar-gaveta]')) setGaveta(null);
  };

  return (
    <div className={styles.layout}>
      {gaveta && (
        <button
          type="button"
          className={styles.veu}
          aria-label="Fechar painel"
          onClick={() => setGaveta(null)}
        />
      )}

      <aside
        className={`${styles.coluna} ${styles.colunaEsquerda} ${gaveta === 'esquerda' ? styles.gavetaAberta : ''}`}
        onClick={aoClicarNaGaveta}
      >
        <button type="button" className={styles.fechar} aria-label="Fechar painel" onClick={() => setGaveta(null)}>
          <X size={20} aria-hidden="true" />
        </button>
        {esquerda}
      </aside>

      <div className={styles.centro}>{centro}</div>

      <aside
        className={`${styles.coluna} ${styles.colunaDireita} ${gaveta === 'direita' ? styles.gavetaAberta : ''}`}
        onClick={aoClicarNaGaveta}
      >
        <button type="button" className={styles.fechar} aria-label="Fechar painel" onClick={() => setGaveta(null)}>
          <X size={20} aria-hidden="true" />
        </button>
        {direita}
      </aside>

      <div className={styles.barraGavetas}>
        <button type="button" className={styles.botaoGaveta} onClick={() => setGaveta('esquerda')}>
          <ListFilter size={18} aria-hidden="true" />
          {rotuloEsquerda}
        </button>
        <button type="button" className={styles.botaoGaveta} onClick={() => setGaveta('direita')}>
          <SlidersHorizontal size={18} aria-hidden="true" />
          {rotuloDireita}
        </button>
      </div>
    </div>
  );
}
