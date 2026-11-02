"use client";

import { useMemo } from 'react';
import PainelAnimacoes from '@/features/animacoes/components/PainelAnimacoes';
import { useAnimacoes } from '@/features/animacoes/hooks/useAnimacoes';
import type { AnimacaoResumoDTO } from '@/features/animacoes/types';
import BarraPalco from '@/features/motor/components/BarraPalco';
import Palco from '@/features/motor/components/Palco';
import { usePalco } from '@/features/motor/hooks/usePalco';
import ListaCategorias from '@/features/secoes/components/ListaCategorias';
import ListaVariacoes from '@/features/secoes/components/ListaVariacoes';
import type { CategoriaDTO, SecaoDTO } from '@/features/secoes/types';
import { criarEstadoGlobal } from '@/shared/hooks/useEstadoGlobal';
import BotaoCopiar from '@/shared/ui/BotaoCopiar';
import LayoutTresColunas from '@/shared/ui/LayoutTresColunas';
import { montarDocumento, montarPalco } from '@/shared/utils/montarDocumento';
import styles from './style.module.css';

const useAnimacaoEscolhida = criarEstadoGlobal<string | null>('entrada');

interface CatalogoProps {
  secao: SecaoDTO;
  categorias: CategoriaDTO[];
  animacoes: AnimacaoResumoDTO[];
  tema: string;
}

export default function Catalogo({ secao, categorias, animacoes, tema }: CatalogoProps) {
  const [animacaoId, setAnimacaoId] = useAnimacaoEscolhida();
  const { animacao } = useAnimacoes('secao', animacaoId);
  const { dispositivo, setDispositivo, repeticao, repetir } = usePalco();

  const entrada = useMemo(() => ({ tema, secoes: [secao], animacao }), [tema, secao, animacao]);
  const documento = useMemo(() => montarPalco(entrada), [entrada]);
  const codigo = useMemo(() => montarDocumento(entrada, 'fragmento'), [entrada]);
  const variacoes = categorias.find(({ id }) => id === secao.categoria)?.variacoes ?? [];

  return (
    <LayoutTresColunas
      rotuloEsquerda="Seções"
      rotuloDireita="Variações e efeitos"
      esquerda={<ListaCategorias categorias={categorias} categoriaAtiva={secao.categoria} />}
      centro={(
        <div className={styles.palcoColuna}>
          <div className={styles.topo}>
            <h1 key={secao.id} className={styles.titulo}>{secao.nome}</h1>
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
            titulo={`Prévia: ${secao.nome}`}
            dica={animacao?.precisaRolar ? 'Role dentro do palco para ver o efeito' : undefined}
          />
        </div>
      )}
      direita={(
        <div className={styles.colunaPainel}>
          <ListaVariacoes variacoes={variacoes} variacaoAtiva={secao.id} />
          <PainelAnimacoes
            tipo="secao"
            titulo="Animações"
            animacoes={animacoes}
            animacaoAtiva={animacaoId}
            aoEscolher={setAnimacaoId}
          />
        </div>
      )}
    />
  );
}
