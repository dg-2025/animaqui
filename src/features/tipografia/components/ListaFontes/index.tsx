"use client";

import { memo, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import CampoBusca from '@/shared/ui/CampoBusca';
import PainelSecao from '@/shared/ui/PainelSecao';
import { urlFonte } from '@/shared/utils/montarDocumento';
import type { FonteDTO } from '../../types';
import styles from './style.module.css';

const QUANTIDADE_POR_VEZ = 40;

interface ItemFonteProps {
  familia: string;
  estaAtiva: boolean;
  aoEscolher: (familia: string) => void;
}

const amostrasCarregadas = new Set<string>();

// Fora do React de propósito: um <link> renderizado segura a atualização da lista
// até o arquivo chegar, e isso engolia letras enquanto a pessoa digitava na busca.
function carregarAmostra(familia: string) {
  if (amostrasCarregadas.has(familia)) return;
  amostrasCarregadas.add(familia);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = urlFonte(familia, familia);
  document.head.appendChild(link);
}

// Só baixa a amostra da fonte quando ela aparece na lista: são mais de mil famílias.
const ItemFonte = memo(function ItemFonte({ familia, estaAtiva, aoEscolher }: ItemFonteProps) {
  const referencia = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento) return;
    const observador = new IntersectionObserver(([item]) => {
      if (!item.isIntersecting) return;
      carregarAmostra(familia);
      observador.disconnect();
    });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [familia]);

  return (
    <button
      ref={referencia}
      type="button"
      data-fechar-gaveta
      className={`${styles.fonte} ${estaAtiva ? styles.fonteAtiva : ''}`}
      aria-pressed={estaAtiva}
      onClick={() => aoEscolher(familia)}
    >
      <span style={{ fontFamily: `"${familia}", var(--fonte-texto)` }}>{familia}</span>
    </button>
  );
});

interface ListaFontesProps {
  fontes: FonteDTO[];
  fonteAtiva: string;
  estaCarregando: boolean;
  aoEscolher: (familia: string) => void;
}

export default function ListaFontes({ fontes, fonteAtiva, estaCarregando, aoEscolher }: ListaFontesProps) {
  const [busca, setBusca] = useState('');
  const [limite, setLimite] = useState(QUANTIDADE_POR_VEZ);
  const sentinela = useRef<HTMLDivElement>(null);

  const buscaAdiada = useDeferredValue(busca);
  const filtradas = useMemo(() => {
    const termo = buscaAdiada.trim().toLocaleLowerCase('pt-BR');
    return fontes.filter(({ familia }) => familia.toLocaleLowerCase('pt-BR').includes(termo));
  }, [fontes, buscaAdiada]);
  const temMais = filtradas.length > limite;

  useEffect(() => {
    const elemento = sentinela.current;
    if (!elemento || !temMais) return;
    const observador = new IntersectionObserver(([item]) => {
      if (item.isIntersecting) setLimite((atual) => atual + QUANTIDADE_POR_VEZ);
    });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [temMais, limite]);

  return (
    <PainelSecao titulo="Fontes">
      <CampoBusca
        valor={busca}
        rotulo="Pesquisar fonte"
        aoMudar={(valor) => {
          setBusca(valor);
          setLimite(QUANTIDADE_POR_VEZ);
        }}
      />

      {estaCarregando && <p className={styles.aviso}>Carregando fontes...</p>}
      {!estaCarregando && filtradas.length === 0 && <p className={styles.aviso}>Nenhuma fonte com esse nome.</p>}

      <div className={styles.lista}>
        {filtradas.slice(0, limite).map(({ familia }) => (
          <ItemFonte key={familia} familia={familia} estaAtiva={familia === fonteAtiva} aoEscolher={aoEscolher} />
        ))}
        {temMais && <div ref={sentinela} className={styles.sentinela} aria-hidden="true" />}
      </div>
    </PainelSecao>
  );
}
