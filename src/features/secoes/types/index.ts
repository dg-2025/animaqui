export interface VariacaoResumoDTO {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
}

export interface CategoriaDTO {
  id: string;
  nome: string;
  quantidade: number;
  variacoes: VariacaoResumoDTO[];
}

export interface SecaoDTO extends VariacaoResumoDTO {
  html: string;
  css: string;
  js: string;
}
