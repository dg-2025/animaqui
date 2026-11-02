"use client";

import { useMemo } from 'react';
import PainelAnimacoes from '@/features/animacoes/components/PainelAnimacoes';
import type { AnimacaoResumoDTO } from '@/features/animacoes/types';
import BarraPalco from '@/features/motor/components/BarraPalco';
import Palco from '@/features/motor/components/Palco';
import { usePalco } from '@/features/motor/hooks/usePalco';
import CampoFrase from '@/features/tipografia/components/CampoFrase';
import ListaFontes from '@/features/tipografia/components/ListaFontes';
import { useTipografia } from '@/features/tipografia/hooks/useTipografia';
import BotaoCopiar from '@/shared/ui/BotaoCopiar';
import LayoutTresColunas from '@/shared/ui/LayoutTresColunas';
import { montarDocumento, montarPalco } from '@/shared/utils/montarDocumento';
import styles from './style.module.css';

interface TipografiaProps {
  animacoes: AnimacaoResumoDTO[];
  tema: string;
}

export default function Tipografia({ animacoes, tema }: TipografiaProps) {
  const {
    frase,
    setFrase,
    fonte,
    setFonte,
    animacaoId,
    setAnimacaoId,
    fontes,
    estaCarregandoFontes,
    entrada,
  } = useTipografia(tema);
  const { dispositivo, setDispositivo, repeticao, repetir } = usePalco();

  const documento = useMemo(() => montarPalco(entrada), [entrada]);
  const codigo = useMemo(() => montarDocumento(entrada, 'fragmento'), [entrada]);

  return (
    <LayoutTresColunas
      rotuloEsquerda="Fontes"
      rotuloDireita="Animações"
      esquerda={(
        <ListaFontes
          fontes={fontes}
          fonteAtiva={fonte}
          estaCarregando={estaCarregandoFontes}
          aoEscolher={setFonte}
        />
      )}
      centro={(
        <div className={styles.palcoColuna}>
          <h1 className={styles.tituloOculto}>Laboratório de tipografia</h1>
          <div className={styles.topo}>
            <CampoFrase frase={frase} aoMudar={setFrase} />
            <BarraPalco
              dispositivo={dispositivo}
              aoTrocarDispositivo={setDispositivo}
              aoRepetir={repetir}
              acaoPrincipal={<BotaoCopiar texto={codigo} rotulo="Copiar Código" mensagemSucesso="Código copiado!" />}
            />
          </div>
          <Palco
            documento={documento}
            dispositivo={dispositivo}
            repeticao={repeticao}
            titulo={`Prévia da frase na fonte ${fonte}`}
          />
        </div>
      )}
      direita={(
        <PainelAnimacoes
          tipo="texto"
          titulo="Animações"
          animacoes={animacoes}
          animacaoAtiva={animacaoId}
          aoEscolher={setAnimacaoId}
        />
      )}
    />
  );
}
