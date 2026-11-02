import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useAnimacoes } from '@/features/animacoes/hooks/useAnimacoes';
import { httpClient } from '@/shared/lib/httpClient';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { escaparTexto, type EntradaDocumento } from '@/shared/utils/montarDocumento';
import type { FonteDTO } from '../types';

const ATRASO_DIGITACAO = 300;

function montarSecaoDaFrase(frase: string, fonte: string) {
  return {
    id: 'frase-01',
    html: `<section class="frase01">\n  <h1 class="texto" data-texto>${escaparTexto(frase)}</h1>\n</section>`,
    css: `.frase01 {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: var(--espaco-6) var(--margem-lateral);
  text-align: center;
  background: var(--cor-fundo);

  .texto {
    margin: 0;
    font-family: "${fonte.replace(/"/g, '')}", var(--fonte-titulo);
    font-size: var(--titulo-display);
    font-weight: 400;
    line-height: 1.1;
    overflow-wrap: anywhere;
  }
}`,
    js: '',
  };
}

export function useTipografia(tema: string) {
  const [frase, setFrase] = useState('Anima aqui a sua frase');
  const [fonte, setFonte] = useState('Jaro');
  const [animacaoId, setAnimacaoId] = useState<string | null>('letras-surgindo');

  const { data: fontes, isLoading: estaCarregandoFontes } = useSWR(
    '/api/fontes',
    (url: string) => httpClient<FonteDTO[]>(url),
    { revalidateOnFocus: false },
  );
  const { animacao } = useAnimacoes('texto', animacaoId);
  const fraseAtrasada = useDebounce(frase, ATRASO_DIGITACAO);

  const entrada = useMemo<EntradaDocumento>(() => ({
    tema,
    secoes: [montarSecaoDaFrase(fraseAtrasada, fonte)],
    animacao,
    fontes: [fonte],
  }), [tema, fraseAtrasada, fonte, animacao]);

  return {
    frase,
    setFrase,
    fonte,
    setFonte,
    animacaoId,
    setAnimacaoId,
    fontes: fontes ?? [],
    estaCarregandoFontes,
    entrada,
  };
}
