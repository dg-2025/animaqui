import type { MetadataRoute } from 'next';
import { SITE } from '@/shared/lib/site';

const ROBOS_DE_IA = [
  'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User',
  'GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      ...ROBOS_DE_IA.map((userAgent) => ({ userAgent, allow: '/', disallow: ['/api/'] })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
