import type { ReactNode } from 'react';
import styles from './style.module.css';

interface PainelSecaoProps {
  titulo: string;
  children: ReactNode;
}

export default function PainelSecao({ titulo, children }: PainelSecaoProps) {
  return (
    <section className={styles.painel}>
      <h2 className={styles.titulo}>{titulo}</h2>
      {children}
    </section>
  );
}
