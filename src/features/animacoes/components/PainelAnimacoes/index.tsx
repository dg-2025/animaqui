"use client";

import type { CSSProperties } from 'react';
import { Ban, Sparkles } from 'lucide-react';
import PainelSecao from '@/shared/ui/PainelSecao';
import { adiantarAnimacao } from '../../hooks/useAnimacoes';
import type { AnimacaoResumoDTO, TipoAnimacao } from '../../types';
import styles from './style.module.css';

interface PainelAnimacoesProps {
  titulo: string;
  tipo: TipoAnimacao;
  animacoes: AnimacaoResumoDTO[];
  animacaoAtiva: string | null;
  aoEscolher: (id: string | null) => void;
}

export default function PainelAnimacoes({ titulo, tipo, animacoes, animacaoAtiva, aoEscolher }: PainelAnimacoesProps) {
  const opcoes = [
    { id: null, nome: 'Nenhuma', descricao: 'Sem movimento: a seção aparece pronta.' },
    ...animacoes,
  ];

  return (
    <PainelSecao titulo={titulo}>
      <div className={styles.grade}>
        {opcoes.map(({ id, nome, descricao }, indice) => (
          <button
            key={id ?? 'nenhuma'}
            type="button"
            data-fechar-gaveta
            className={`${styles.opcao} ${id === animacaoAtiva ? styles.opcaoAtiva : ''}`}
            style={{ '--i': indice } as CSSProperties}
            aria-pressed={id === animacaoAtiva}
            title={descricao}
            onPointerEnter={() => id && adiantarAnimacao(tipo, id)}
            onFocus={() => id && adiantarAnimacao(tipo, id)}
            onClick={() => aoEscolher(id)}
          >
            <span className={styles.icone}>
              {id ? <Sparkles size={18} aria-hidden="true" /> : <Ban size={18} aria-hidden="true" />}
            </span>
            {nome}
          </button>
        ))}
      </div>
    </PainelSecao>
  );
}
