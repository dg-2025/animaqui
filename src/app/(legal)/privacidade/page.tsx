import { metadadosDaPagina, SITE } from '@/shared/lib/site';
import PaginaLegal from '@/views/shared/PaginaLegal';

export const metadata = metadadosDaPagina({
  titulo: 'Política de Privacidade',
  descricao: 'Quais dados o animaqui trata, com quem compartilha e como exercer seus direitos pela LGPD.',
  caminho: '/privacidade',
});

export default function PrivacidadePage() {
  return (
    <PaginaLegal titulo="Política de Privacidade">
      <p>O {SITE.nome} não tem cadastro nem login, e os formulários de exemplo das seções não enviam nada. Você usa o site sem informar seu nome, e-mail ou telefone.</p>

      <h2>Quem é o responsável?</h2>
      <p>{SITE.responsavel}. {SITE.documento}. Contato: {SITE.contato}.</p>

      <h2>Quais dados são tratados e para quê?</h2>
      <ul>
        <li><strong>Endereço IP e dados técnicos do navegador:</strong> registrados pela hospedagem para entregar as páginas e manter o site seguro.</li>
        <li><strong>Endereço IP, pelo Google Fonts:</strong> enviado ao Google quando o seu navegador baixa uma fonte para mostrar uma seção ou o laboratório de tipografia.</li>
      </ul>
      <p>A frase que você digita na Tipografia fica só no seu navegador e não é enviada a ninguém.</p>

      <h2>Com quem os dados são compartilhados?</h2>
      <ul>
        <li>Com a empresa de hospedagem do site.</li>
        <li>Com o Google, pelo Google Fonts. O tratamento segue a <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidade do Google</a>.</li>
      </ul>

      <h2>Por quanto tempo os dados ficam guardados?</h2>
      <p>O {SITE.nome} não mantém banco de dados de visitantes. Os registros técnicos ficam com a hospedagem e com o Google, pelos prazos definidos por cada um.</p>

      <h2>O site usa cookies?</h2>
      <p>Não. O {SITE.nome} não usa cookies próprios nem ferramentas de análise ou de anúncios. Se isso mudar, esta página será atualizada e você poderá recusar antes de qualquer ativação.</p>

      <h2>Quais são os seus direitos?</h2>
      <p>A LGPD garante a você confirmar se há tratamento, acessar, corrigir e pedir a exclusão dos seus dados, além de tirar dúvidas sobre o compartilhamento. Para isso, escreva para {SITE.contato}.</p>
    </PaginaLegal>
  );
}
