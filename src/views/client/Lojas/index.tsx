"use client";

import { useMemo } from 'react';
import ListaLojas from '@/features/lojas/components/ListaLojas';
import ListaPaginas from '@/features/lojas/components/ListaPaginas';
import { useLoja } from '@/features/lojas/hooks/useLoja';
import type { LojaDTO, LojaResumoDTO } from '@/features/lojas/types';
import BarraPalco from '@/features/motor/components/BarraPalco';
import Palco from '@/features/motor/components/Palco';
import { usePalco } from '@/features/motor/hooks/usePalco';
import BotaoCopiar from '@/shared/ui/BotaoCopiar';
import LayoutTresColunas from '@/shared/ui/LayoutTresColunas';
import { montarDocumento } from '@/shared/utils/montarDocumento';
import styles from './style.module.css';

interface LojasProps {
  loja: LojaDTO;
  lojas: LojaResumoDTO[];
  tema: string;
}

export default function Lojas({ loja, lojas, tema }: LojasProps) {
  const { entrada, estaCompleto, paginaInicial, setPaginaInicial } = useLoja(loja, tema);
  const { dispositivo, setDispositivo, repeticao, repetir } = usePalco();

  // Mesmo documento no palco e na cópia: a loja inteira, com a navegação entre as páginas.
  const documento = useMemo(() => (entrada ? montarDocumento(entrada, 'documento') : null), [entrada]);

  return (
    <LayoutTresColunas
      rotuloEsquerda="Lojas"
      rotuloDireita="Páginas"
      esquerda={<ListaLojas lojas={lojas} lojaAtiva={loja.id} />}
      centro={(
        <div className={styles.palcoColuna}>
          <div className={styles.topo}>
            <h1 key={loja.id} className={styles.titulo}>{loja.nome}</h1>
            <BarraPalco
              dispositivo={dispositivo}
              aoTrocarDispositivo={setDispositivo}
              aoRepetir={repetir}
              acaoPrincipal={(
                <BotaoCopiar
                  texto={documento ?? ''}
                  rotulo="Copiar Loja"
                  mensagemSucesso="Loja inteira copiada!"
                  estaDesabilitado={!estaCompleto}
                />
              )}
            />
          </div>
          <Palco
            documento={documento}
            dispositivo={dispositivo}
            repeticao={repeticao}
            titulo={`Prévia da loja ${loja.nome}`}
            vazio={<p className={styles.carregando}>Montando a loja...</p>}
          />
        </div>
      )}
      direita={(
        <div className={styles.colunaPainel}>
          <ListaPaginas paginas={loja.paginas} paginaAtiva={paginaInicial} aoEscolher={setPaginaInicial} />
        </div>
      )}
    />
  );
}
