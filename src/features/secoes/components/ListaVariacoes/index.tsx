import type { CSSProperties } from 'react';
import Link from 'next/link';
import PainelSecao from '@/shared/ui/PainelSecao';
import type { VariacaoResumoDTO } from '../../types';
import styles from './style.module.css';

interface ListaVariacoesProps {
  variacoes: VariacaoResumoDTO[];
  variacaoAtiva: string;
}

export default function ListaVariacoes({ variacoes, variacaoAtiva }: ListaVariacoesProps) {
  return (
    <PainelSecao titulo="Variações">
      <ul className={styles.lista}>
        {variacoes.map(({ id, nome, descricao, categoria }, indice) => (
          <li key={id} className={styles.item} style={{ '--i': indice } as CSSProperties}>
            <Link
              href={`/secoes/${categoria}/${id}`}
              prefetch
              scroll={false}
              className={`${styles.cartao} ${id === variacaoAtiva ? styles.cartaoAtivo : ''}`}
              aria-current={id === variacaoAtiva ? 'true' : undefined}
            >
              <span className={styles.numero} aria-hidden="true">{String(indice + 1).padStart(2, '0')}</span>
              <span className={styles.texto}>
                <strong className={styles.nome}>{nome}</strong>
                <span className={styles.descricao}>{descricao}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PainelSecao>
  );
}
