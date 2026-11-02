import Link from 'next/link';
import { metadadosDaPagina, SITE } from '@/shared/lib/site';
import PaginaLegal from '@/views/shared/PaginaLegal';

export const metadata = metadadosDaPagina({
  titulo: 'Termos de Uso',
  descricao: 'O que é o animaqui, como usar o código copiado e os limites de responsabilidade do site.',
  caminho: '/termos',
});

export default function TermosPage() {
  return (
    <PaginaLegal titulo="Termos de Uso">
      <p>Ao usar o {SITE.nome}, você concorda com estes termos. O site é gratuito e não vende nenhum produto ou serviço.</p>

      <h2>Quem oferece o site?</h2>
      <p>{SITE.responsavel}. {SITE.documento}. Contato: {SITE.contato}.</p>

      <h2>O que é o {SITE.nome}?</h2>
      <p>Um laboratório visual para navegar, testar e copiar seções prontas de sites. O conteúdo pode mudar ou sair do ar sem aviso.</p>

      <h2>Posso usar o código copiado?</h2>
      <p>Sim. Você pode usar o código das seções nos seus projetos, pessoais ou comerciais. Os textos de exemplo devem ser trocados pelos seus, e cada fonte do Google Fonts segue a licença dela.</p>

      <h2>Quais são os limites de responsabilidade?</h2>
      <p>O código é oferecido como está, sem garantia de funcionamento em todos os cenários. Testar, adaptar e cuidar da segurança e da conformidade legal do seu próprio site é responsabilidade sua.</p>

      <h2>Como seus dados são tratados?</h2>
      <p>Veja a <Link href="/privacidade">Política de Privacidade</Link>.</p>

      <h2>Qual é o foro?</h2>
      <p>Estes termos seguem a lei brasileira. Fica eleito o foro de {SITE.foro}, sem prejuízo dos direitos do consumidor.</p>
    </PaginaLegal>
  );
}
