"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { Dispositivo } from '../../types';
import styles from './style.module.css';

// O modo Computador simula esta largura e reduz o desenho para caber no palco.
// Sem isso, a coluna central ficaria abaixo dos breakpoints e mostraria o layout de tablet.
const LARGURA_COMPUTADOR = 1280;
// Mesmo tempo de --duracao-rapida: o quadro antigo só sai depois que o novo terminou de aparecer.
const TEMPO_TROCA = 150;
// Se uma fonte externa demorar, o palco não pode ficar preso no quadro antigo.
const LIMITE_CARREGAMENTO = 1200;

interface Quadro {
  chave: string;
  documento: string;
  estaPronto: boolean;
}

interface PalcoProps {
  documento: string | null;
  dispositivo: Dispositivo;
  repeticao: number;
  titulo: string;
  dica?: string;
  vazio?: ReactNode;
}

export default function Palco({ documento, dispositivo, repeticao, titulo, dica, vazio }: PalcoProps) {
  const moldura = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(1);
  const [quadros, setQuadros] = useState<Quadro[]>(
    documento ? [{ chave: `${repeticao}-${documento}`, documento, estaPronto: true }] : [],
  );
  const temDocumento = documento !== null;
  const chaveAtual = documento ? `${repeticao}-${documento}` : null;
  const estaNoCelular = dispositivo === 'celular';

  // Ajuste durante a renderização: o documento mudou, então entra um quadro novo por cima do atual.
  if (chaveAtual && documento && quadros[quadros.length - 1]?.chave !== chaveAtual) {
    const visivel = quadros.filter((quadro) => quadro.estaPronto).slice(-1);
    setQuadros([...visivel, { chave: chaveAtual, documento, estaPronto: visivel.length === 0 }]);
  } else if (!chaveAtual && quadros.length > 0) {
    setQuadros([]);
  }

  const revelar = (chave: string) => {
    setQuadros((atuais) => atuais.map((quadro) => (quadro.chave === chave ? { ...quadro, estaPronto: true } : quadro)));
  };

  useLayoutEffect(() => {
    const elemento = moldura.current;
    if (!elemento) return;
    const medir = () => setEscala(Math.min(1, elemento.clientWidth / LARGURA_COMPUTADOR));
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [temDocumento]);

  const ultimo = quadros[quadros.length - 1];

  // Garante que o novo apareça mesmo se o carregamento demorar.
  useEffect(() => {
    if (!ultimo || ultimo.estaPronto) return;
    const relogio = setTimeout(() => revelar(ultimo.chave), LIMITE_CARREGAMENTO);
    return () => clearTimeout(relogio);
  }, [ultimo]);

  // Depois que o novo apareceu, o antigo deixa de existir.
  useEffect(() => {
    if (quadros.length < 2 || !ultimo?.estaPronto) return;
    const relogio = setTimeout(() => setQuadros((atuais) => atuais.slice(-1)), TEMPO_TROCA);
    return () => clearTimeout(relogio);
  }, [quadros.length, ultimo?.estaPronto]);

  // O Next mantém páginas visitadas escondidas: sem isso, o palco delas seguiria rodando animações.
  useEffect(() => {
    const elemento = moldura.current;
    if (!elemento) return;
    elemento.querySelectorAll('iframe').forEach((quadro) => {
      const guardado = quadro.dataset.documento;
      if (guardado !== undefined && !quadro.hasAttribute('srcdoc')) quadro.srcdoc = guardado;
    });
    return () => {
      if (elemento.getClientRects().length > 0) return;
      elemento.querySelectorAll('iframe').forEach((quadro) => {
        quadro.dataset.documento = quadro.srcdoc;
        quadro.removeAttribute('srcdoc');
      });
    };
  });

  return (
    <div className={styles.palco}>
      {quadros.length > 0 ? (
        <div ref={moldura} className={`${styles.moldura} ${estaNoCelular ? styles.molduraCelular : ''}`}>
          {quadros.map((quadro) => (
            <iframe
              key={quadro.chave}
              className={`${styles.quadro} ${estaNoCelular ? '' : styles.quadroComputador} ${quadro.estaPronto ? '' : styles.quadroEsperando}`}
              style={{ '--escala': escala } as CSSProperties}
              title={titulo}
              sandbox="allow-scripts"
              srcDoc={quadro.documento}
              onLoad={() => revelar(quadro.chave)}
            />
          ))}
        </div>
      ) : vazio}
      {documento && dica && <p className={styles.dica}>{dica}</p>}
    </div>
  );
}
