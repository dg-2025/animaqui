"use client";

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, LayoutGrid, Type } from 'lucide-react';
import styles from './style.module.css';

const MODULOS = [
  { href: '/secoes', rotulo: 'Seções', Icone: LayoutGrid },
  { href: '/tipografia', rotulo: 'Tipografia', Icone: Type },
  { href: '/montador', rotulo: 'Montador', Icone: Layers },
];

const LETRAS = ['a', 'n', 'i', 'm', 'a', 'q', 'u', 'i'];

export default function BarraModulos() {
  const caminho = usePathname();
  const indiceAtivo = MODULOS.findIndex(({ href }) => caminho.startsWith(href));

  return (
    <header className={styles.barra}>
      <Link href="/secoes" className={styles.marca} aria-label="animaqui, ir para o início">
        <span className={styles.bola} aria-hidden="true" />
        {LETRAS.map((letra, indice) => (
          <span
            key={indice}
            aria-hidden="true"
            className={styles.letra}
            style={{ '--i': indice } as CSSProperties}
          >
            {letra}
          </span>
        ))}
      </Link>

      <nav className={styles.modulos} aria-label="Módulos">
        {indiceAtivo >= 0 && (
          <span
            className={styles.indicador}
            style={{ '--indice': indiceAtivo } as CSSProperties}
            aria-hidden="true"
          />
        )}
        {MODULOS.map(({ href, rotulo, Icone }, indice) => (
          <Link
            key={href}
            href={href}
            className={`${styles.modulo} ${indice === indiceAtivo ? styles.moduloAtivo : ''}`}
            aria-current={indice === indiceAtivo ? 'page' : undefined}
          >
            <Icone size={18} aria-hidden="true" />
            {rotulo}
          </Link>
        ))}
      </nav>
    </header>
  );
}
