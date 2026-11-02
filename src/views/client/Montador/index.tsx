"use client";

import { useEffect, useMemo } from 'react';
import { Wand2 } from 'lucide-react';
import PainelAnimacoes from '@/features/animacoes/components/PainelAnimacoes';
import type { AnimacaoResumoDTO } from '@/features/animacoes/types';
import PilhaBlocos from '@/features/montador/components/PilhaBlocos';
import SeletorBlocos from '@/features/montador/components/SeletorBlocos';
import { useMontador } from '@/features/montador/hooks/useMontador';
import BarraPalco from '@/features/motor/components/BarraPalco';
import Palco from '@/features/motor/components/Palco';
import { usePalco } from '@/features/motor/hooks/usePalco';
import { adiantarSecao } from '@/features/secoes/hooks/useSecoes';
import type { CategoriaDTO } from '@/features/secoes/types';
import BotaoCopiar from '@/shared/ui/BotaoCopiar';
import LayoutTresColunas from '@/shared/ui/LayoutTresColunas';
import { montarDocumento } from '@/shared/utils/montarDocumento';
import styles from './style.module.css';

const ESQUELETO_BASICO = ['cabecalho', 'hero', 'depoimentos', 'rodape'];

interface MontadorProps {
  categorias: CategoriaDTO[];
  animacoes: AnimacaoResumoDTO[];
  tema: string;
}

export default function Montador({ categorias, animacoes, tema }: MontadorProps) {
  const { pilha, adicionar, remover, mover, animacaoId, setAnimacaoId, entrada, estaCompleto } = useMontador(tema);
  const { dispositivo, setDispositivo, repeticao, repetir } = usePalco();

  // A página inteira já rola: o palco mostra exatamente o documento copiado.
  const documento = useMemo(() => (entrada ? montarDocumento(entrada, 'documento') : null), [entrada]);

  const esqueletoBasico = useMemo(() => ESQUELETO_BASICO.flatMap(
    (id) => categorias.find((categoria) => categoria.id === id)?.variacoes[0] ?? [],
  ), [categorias]);

  // "Começar com o básico" é o clique mais provável: já deixa pronto.
  useEffect(() => {
    esqueletoBasico.forEach(adiantarSecao);
  }, [esqueletoBasico]);

  return (
    <LayoutTresColunas
      rotuloEsquerda="Blocos"
      rotuloDireita={`Sua página (${pilha.length})`}
      esquerda={<SeletorBlocos categorias={categorias} aoAdicionar={adicionar} />}
      centro={(
        <div className={styles.palcoColuna}>
          <div className={styles.topo}>
            <h1 className={styles.titulo}>Montador</h1>
            <BarraPalco
              dispositivo={dispositivo}
              aoTrocarDispositivo={setDispositivo}
              aoRepetir={repetir}
              acaoPrincipal={(
                <BotaoCopiar
                  texto={documento ?? ''}
                  rotulo="Copiar Site"
                  mensagemSucesso="Site inteiro copiado!"
                  estaDesabilitado={!estaCompleto}
                />
              )}
            />
          </div>
          <Palco
            documento={documento}
            dispositivo={dispositivo}
            repeticao={repeticao}
            titulo="Prévia da página montada"
            vazio={pilha.length === 0 ? (
              <div className={styles.vazio}>
                <h2 className={styles.vazioTitulo}>Empilhe sua página</h2>
                <p className={styles.vazioTexto}>Escolha os blocos ou comece com um esqueleto pronto.</p>
                <button type="button" className={styles.vazioBotao} onClick={() => adicionar(esqueletoBasico)}>
                  <Wand2 size={20} aria-hidden="true" />
                  Começar com o básico
                </button>
              </div>
            ) : <p className={styles.carregando}>Montando...</p>}
          />
        </div>
      )}
      direita={(
        <div className={styles.colunaPainel}>
          <PilhaBlocos pilha={pilha} aoMover={mover} aoRemover={remover} />
          <PainelAnimacoes
            tipo="secao"
            titulo="Animação"
            animacoes={animacoes}
            animacaoAtiva={animacaoId}
            aoEscolher={setAnimacaoId}
          />
        </div>
      )}
    />
  );
}
