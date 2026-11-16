import type { ReferenciaSecao } from '@/features/secoes/hooks/useSecoes';

export interface PaginaLojaDTO {
  id: string;
  nome: string;
  secoes: ReferenciaSecao[];
}

export interface LojaResumoDTO {
  id: string;
  nome: string;
  segmento: string;
  descricao: string;
}

export interface NavegacaoDTO {
  id: string;
  html: string;
  css: string;
  js: string;
}

export interface LojaDTO extends LojaResumoDTO {
  paginas: PaginaLojaDTO[];
  navegacao: NavegacaoDTO;
}
