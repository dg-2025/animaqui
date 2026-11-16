import PainelSecao from '@/shared/ui/PainelSecao';
import type { PaginaLojaDTO } from '../../types';
import styles from './style.module.css';

interface ListaPaginasProps {
  paginas: PaginaLojaDTO[];
  paginaAtiva: string;
  aoEscolher: (id: string) => void;
}

export default function ListaPaginas({ paginas, paginaAtiva, aoEscolher }: ListaPaginasProps) {
  return (
    <PainelSecao titulo={`Páginas (${paginas.length})`}>
      <ol className={styles.lista}>
        {paginas.map(({ id, nome, secoes }, indice) => (
          <li key={id}>
            <button
              type="button"
              className={`${styles.botao} ${id === paginaAtiva ? styles.botaoAtivo : ''}`}
              aria-pressed={id === paginaAtiva}
              onClick={() => aoEscolher(id)}
            >
              <span className={styles.numero} aria-hidden="true">{String(indice + 1).padStart(2, '0')}</span>
              <span className={styles.texto}>
                <strong>{nome}</strong>
                <span className={styles.secoes}>{secoes.map((secao) => secao.id).join(' + ')}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className={styles.dica}>Também dá para navegar pela barra da própria loja, dentro do palco. O carrinho conta em todas as páginas.</p>
    </PainelSecao>
  );
}
