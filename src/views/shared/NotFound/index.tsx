import Link from 'next/link';
import styles from './style.module.css';

export default function NotFound() {
  return (
    <main className={styles.pagina}>
      <h1 className={styles.titulo}>404</h1>
      <p className={styles.texto}>Essa página não está no nosso palco.</p>
      <Link href="/secoes" className={styles.botao}>Voltar para as seções</Link>
    </main>
  );
}
