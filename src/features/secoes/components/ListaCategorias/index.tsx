"use client";

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import CampoBusca from '@/shared/ui/CampoBusca';
import PainelSecao from '@/shared/ui/PainelSecao';
import type { CategoriaDTO } from '../../types';
import styles from './style.module.css';

interface ListaCategoriasProps {
  categorias: CategoriaDTO[];
  categoriaAtiva: string;
}

export default function ListaCategorias({ categorias, categoriaAtiva }: ListaCategoriasProps) {
  const [busca, setBusca] = useState('');
  const termo = busca.trim().toLocaleLowerCase('pt-BR');
  const visiveis = categorias.filter(
    ({ nome, quantidade }) => quantidade > 0 && nome.toLocaleLowerCase('pt-BR').includes(termo),
  );

  return (
    <PainelSecao titulo="Seções">
      <CampoBusca valor={busca} rotulo="Pesquisar categoria" aoMudar={setBusca} />

      {visiveis.length === 0 && <p className={styles.vazio}>Nenhuma categoria com esse nome.</p>}

      <ul className={styles.lista}>
        {visiveis.map(({ id, nome, quantidade, variacoes }, indice) => (
          <li key={id} style={{ '--i': indice } as CSSProperties} className={styles.item}>
            <Link
              href={`/secoes/${id}/${variacoes[0].id}`}
              prefetch
              className={`${styles.categoria} ${id === categoriaAtiva ? styles.categoriaAtiva : ''}`}
              aria-current={id === categoriaAtiva ? 'true' : undefined}
            >
              <span className={styles.nome}>{nome}</span>
              <span className={styles.contador}>{quantidade}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PainelSecao>
  );
}
