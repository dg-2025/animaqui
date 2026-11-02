"use client";

import { useSyncExternalStore } from 'react';
import { Check, TriangleAlert } from 'lucide-react';
import styles from './style.module.css';

interface MensagemToast {
  id: number;
  texto: string;
  tipo: 'sucesso' | 'erro';
}

const DURACAO = 2600;
let mensagens: MensagemToast[] = [];
let proximoId = 0;
const ouvintes = new Set<() => void>();

function publicar(novas: MensagemToast[]) {
  mensagens = novas;
  ouvintes.forEach((ouvinte) => ouvinte());
}

function mostrar(texto: string, tipo: MensagemToast['tipo']) {
  proximoId += 1;
  const id = proximoId;
  publicar([...mensagens, { id, texto, tipo }]);
  setTimeout(() => publicar(mensagens.filter((mensagem) => mensagem.id !== id)), DURACAO);
}

export const toast = {
  sucesso: (texto: string) => mostrar(texto, 'sucesso'),
  erro: (texto: string) => mostrar(texto, 'erro'),
};

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

const SEM_MENSAGENS: MensagemToast[] = [];

export default function Toast() {
  const atuais = useSyncExternalStore(assinar, () => mensagens, () => SEM_MENSAGENS);

  return (
    <div className={styles.area} role="status" aria-live="polite">
      {atuais.map(({ id, texto, tipo }) => (
        <div key={id} className={`${styles.aviso} ${tipo === 'erro' ? styles.avisoErro : ''}`}>
          {tipo === 'erro' ? <TriangleAlert size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
          {texto}
        </div>
      ))}
    </div>
  );
}
