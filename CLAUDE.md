@AGENTS.md

# animaqui

Laboratório visual de componentes web: qualquer pessoa navega, testa e copia seções prontas de sites em poucos cliques.

> Tipo: **SaaS, sem banco nem login na v1**. As regras gerais e o mapa do Guia já vêm do `CLAUDE.md` global; aqui fica só o que é deste projeto.

## Antes de começar

1. Ler o `DOCUMENTACAO.md` da raiz: é o norte do projeto (o que existe e, na 2.8, o que está planejado).
2. Coisa nova? Conversar pelo [[planejar-tarefa-nova]] e escrever o plano na 2.8 antes do código.

**O `DOCUMENTACAO.md` é o único documento.** Toda sprint atualiza no mesmo commit: RF, RN, CT, matriz, a 2.8 e o Histórico de Revisões ([[documentar-projeto]]). Não existe `docs/` nem `progresso.md`.

## Projeto

- Stack: Next.js, estático por padrão. Hospedagem: a definir (P-05 da 2.8).
- Multiempresa: não.
- Variáveis de ambiente: `GOOGLE_FONTS_API_KEY` (só no servidor) e `NEXT_PUBLIC_SITE_URL` (endereço público do site).

## Regras deste projeto

- `banco-de-dados/` guarda o conteúdo do site em arquivos: não é um banco de verdade. Seção nova entra em `banco-de-dados/secoes/` e animação nova em `banco-de-dados/animacoes/`, em HTML, CSS e JS puros, nunca em React. Não precisa mudar código.
- `montarDocumento()`, em `src/shared/utils/montarDocumento.ts`, é a única função que monta palco e cópia. Nunca criar outro caminho de exportação.
- Foto em seção (D-28): buscar no Pixabay com a `PIXABAY_API_KEY` do `.env` do Social-Midia (nunca mostrar a chave), cortar, reduzir para WebP e embutir como `data:` no `secao.html`. Registrar a origem na tabela "Fotos do Pixabay" da seção 10 do `DOCUMENTACAO.md`.

## Interface

Aplicada em `src/app/global.css`: interface monocromática, com cores variadas só nos detalhes (`--cor-acento-*`); títulos em Jaro e texto em Nunito.

- Sistema de design: próprio (clay + minimal poster), sobre o contrato de [[tokens]]. Títulos e marca em Jaro, só no peso 400.
- Grid principal: 3 colunas (menu, palco, painel); gavetas abaixo de 1024 px.
- Estilo visual: Clay 3D nos controles e superfícies ([[estilos-visuais]]), poster na composição.

## Exceções aos guias

- **Sem Supabase, auth e Server Actions** na v1: não há banco nem mutação no servidor. Mantém `app`, `features`, `shared` e `views` de [[saas]]; os services leem arquivos em vez do banco, e só eles mudam se vier banco.
- **`banco-de-dados/` fora das regras de componente React** de [[base-frontend]]: são HTML, CSS e JS puros para serem exportados. As classes continuam em português e camelCase, e todo valor vem de token.
- **Duas camadas de tokens:** `src/app/global.css` (plataforma) e `banco-de-dados/tema-padrao.css` (seções e código copiado).
- **Tema claro de loja (D-25):** `tema-padrao.css` tem o bloco `[data-tema="claro"]` e a seção de loja liga com `data-tema="claro"` na raiz. Exceção ao contrato de [[tokens]] ("o bloco não sabe qual tema está ativo"), escolhida pelo Daniel em 16/11/2026.
- **Seção de loja é celular primeiro (D-24):** CSS base do celular, computador por `min-width`.
