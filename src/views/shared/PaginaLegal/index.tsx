import type { ReactNode } from 'react';
import Link from 'next/link';
import { SITE } from '@/shared/lib/site';
import styles from './style.module.css';

export default function PaginaLegal({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className={styles.pagina}>
      <article className={styles.conteudo}>
        <Link href="/secoes" className={styles.voltar}>Voltar para as seções</Link>
        <h1 className={styles.titulo}>{titulo}</h1>
        <p className={styles.data}>Atualizado em {SITE.legalAtualizadoEm}.</p>
        {children}
      </article>
    </main>
  );
}
