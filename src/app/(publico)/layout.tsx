import type { ReactNode } from 'react';
import Link from 'next/link';
import BarraModulos from '@/shared/ui/BarraModulos';
import Toast from '@/shared/ui/Toast';
import styles from './style.module.css';

export default function PublicoLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.aplicacao}>
      <BarraModulos />
      <main className={styles.conteudo}>{children}</main>
      <footer className={styles.rodape}>
        <Link href="/privacidade" className={styles.linkRodape}>Privacidade</Link>
        <Link href="/termos" className={styles.linkRodape}>Termos</Link>
      </footer>
      <Toast />
    </div>
  );
}
