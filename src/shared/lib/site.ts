import type { Metadata } from 'next';

export const SITE = {
  nome: 'animaqui',
  descricao: 'Teste, anime e copie seções prontas para o seu site em poucos cliques.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  imagemCompartilhamento: '/essenciais/compartilhamento.jpg',
  // Aparecem nas páginas legais: preencher antes de publicar.
  responsavel: 'TODO: nome ou razão social do responsável',
  documento: 'TODO: CNPJ, se houver',
  contato: 'TODO: e-mail de contato',
  foro: 'TODO: cidade e estado do foro',
  legalAtualizadoEm: '2 de novembro de 2026',
};

// O openGraph da página substitui o do layout inteiro, por isso a imagem é repetida aqui.
export function metadadosDaPagina({ titulo, descricao, caminho }: {
  titulo: string;
  descricao: string;
  caminho: string;
}): Metadata {
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: SITE.nome,
      title: `${titulo} | ${SITE.nome}`,
      description: descricao,
      url: caminho,
      images: [{ url: SITE.imagemCompartilhamento, width: 1200, height: 630, alt: SITE.nome }],
    },
  };
}
