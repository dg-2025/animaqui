import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Jaro, Nunito } from 'next/font/google';
import { SITE } from '@/shared/lib/site';
import './global.css';

const fonteTitulo = Jaro({ subsets: ['latin'], variable: '--font-titulo' });
const fonteTexto = Nunito({ subsets: ['latin'], variable: '--font-texto' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.nome, template: `%s | ${SITE.nome}` },
  description: SITE.descricao,
  icons: {
    icon: [{ url: '/essenciais/icone.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/essenciais/icone-apple.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE.nome,
    title: SITE.nome,
    description: SITE.descricao,
    images: [{ url: SITE.imagemCompartilhamento, width: 1200, height: 630, alt: SITE.nome }],
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE.nome,
  url: SITE.url,
  description: SITE.descricao,
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Web',
  inLanguage: 'pt-BR',
  isAccessibleForFree: true,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fonteTitulo.variable} ${fonteTexto.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      </body>
    </html>
  );
}
