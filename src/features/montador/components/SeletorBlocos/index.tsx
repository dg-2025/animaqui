"use client";

import { Plus } from 'lucide-react';
import { adiantarSecao } from '@/features/secoes/hooks/useSecoes';
import type { CategoriaDTO, VariacaoResumoDTO } from '@/features/secoes/types';
import PainelSecao from '@/shared/ui/PainelSecao';
import styles from './style.module.css';

interface SeletorBlocosProps {
  categorias: CategoriaDTO[];
  aoAdicionar: (variacoes: VariacaoResumoDTO[]) => void;
}

export default function SeletorBlocos({ categorias, aoAdicionar }: SeletorBlocosProps) {
  return (
    <PainelSecao titulo="Blocos">
      <div className={styles.grupos}>
        {categorias.filter(({ quantidade }) => quantidade > 0).map(({ id, nome, variacoes }) => (
          <div key={id} className={styles.grupo}>
            <h3 className={styles.categoria}>{nome}</h3>
            {variacoes.map((variacao) => (
              <button
                key={variacao.id}
                type="button"
                data-fechar-gaveta
                className={styles.bloco}
                title={variacao.descricao}
                onPointerEnter={() => adiantarSecao(variacao)}
                onFocus={() => adiantarSecao(variacao)}
                onClick={() => aoAdicionar([variacao])}
              >
                <span>{variacao.nome}</span>
                <Plus size={18} aria-hidden="true" className={styles.mais} />
              </button>
            ))}
          </div>
        ))}
      </div>
    </PainelSecao>
  );
}
