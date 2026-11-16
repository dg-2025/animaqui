import type { CSSProperties } from 'react';
import Link from 'next/link';
import PainelSecao from '@/shared/ui/PainelSecao';
import type { LojaResumoDTO } from '../../types';
import styles from './style.module.css';

interface ListaLojasProps {
  lojas: LojaResumoDTO[];
  lojaAtiva: string;
}

export default function ListaLojas({ lojas, lojaAtiva }: ListaLojasProps) {
  return (
    <PainelSecao titulo={`Lojas (${lojas.length})`}>
      <ul className={styles.lista}>
        {lojas.map(({ id, nome, segmento, descricao }, indice) => (
          <li key={id} className={styles.item} style={{ '--i': indice } as CSSProperties}>
            <Link
              href={`/lojas/${id}`}
              prefetch
              scroll={false}
              className={`${styles.cartao} ${id === lojaAtiva ? styles.cartaoAtivo : ''}`}
              aria-current={id === lojaAtiva ? 'true' : undefined}
            >
              <span className={styles.segmento}>{segmento}</span>
              <strong className={styles.nome}>{nome}</strong>
              <span className={styles.descricao}>{descricao}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PainelSecao>
  );
}
