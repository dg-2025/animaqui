import 'server-only';
import { cacheLife } from 'next/cache';
import type { FonteDTO } from '../types';

interface RespostaGoogleFonts {
  items: { family: string; category: string }[];
}

// Usada enquanto a chave da API não existe ou se o Google estiver fora do ar.
const FONTES_PADRAO: FonteDTO[] = [
  ['Jaro', 'display'], ['Inter', 'sans-serif'], ['Roboto', 'sans-serif'], ['Poppins', 'sans-serif'],
  ['Montserrat', 'sans-serif'], ['Nunito', 'sans-serif'], ['Open Sans', 'sans-serif'], ['Lato', 'sans-serif'],
  ['Oswald', 'sans-serif'], ['Raleway', 'sans-serif'], ['Work Sans', 'sans-serif'], ['DM Sans', 'sans-serif'],
  ['Space Grotesk', 'sans-serif'], ['Sora', 'sans-serif'], ['Outfit', 'sans-serif'], ['Manrope', 'sans-serif'],
  ['Playfair Display', 'serif'], ['Merriweather', 'serif'], ['Lora', 'serif'], ['Fraunces', 'serif'],
  ['DM Serif Display', 'serif'], ['Bitter', 'serif'], ['Bebas Neue', 'display'], ['Anton', 'display'],
  ['Archivo Black', 'display'], ['Righteous', 'display'], ['Lobster', 'display'], ['Abril Fatface', 'display'],
  ['Bungee', 'display'], ['Alfa Slab One', 'display'], ['Luckiest Guy', 'display'], ['Fredoka', 'sans-serif'],
  ['Pacifico', 'handwriting'], ['Caveat', 'handwriting'], ['Dancing Script', 'handwriting'],
  ['Permanent Marker', 'handwriting'], ['Shadows Into Light', 'handwriting'], ['Space Mono', 'monospace'],
  ['JetBrains Mono', 'monospace'], ['Fira Code', 'monospace'],
].map(([familia, categoria]) => ({ familia, categoria }));

export async function listarFontesService(): Promise<FonteDTO[]> {
  'use cache';
  cacheLife('weeks');

  const chave = process.env.GOOGLE_FONTS_API_KEY;
  if (!chave) return FONTES_PADRAO;

  try {
    const resposta = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${chave}`);
    if (!resposta.ok) return FONTES_PADRAO;
    const dados = (await resposta.json()) as RespostaGoogleFonts;
    return dados.items.map((item) => ({ familia: item.family, categoria: item.category }));
  } catch {
    return FONTES_PADRAO;
  }
}
