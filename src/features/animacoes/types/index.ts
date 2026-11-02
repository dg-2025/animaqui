export type TipoAnimacao = 'secao' | 'texto';

export interface AnimacaoResumoDTO {
  id: string;
  nome: string;
  descricao: string;
  tipo: TipoAnimacao;
  precisaRolar: boolean;
}

export interface AnimacaoDTO extends AnimacaoResumoDTO {
  css: string;
  js: string;
}
