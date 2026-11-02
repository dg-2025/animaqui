"use client";

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { copiarTexto } from '@/shared/utils/copiarTexto';
import { toast } from '@/shared/ui/Toast';
import styles from './style.module.css';

const TEMPO_CONFIRMACAO = 1800;

interface BotaoCopiarProps {
  texto: string;
  rotulo: string;
  mensagemSucesso: string;
  estaDesabilitado?: boolean;
}

export default function BotaoCopiar({ texto, rotulo, mensagemSucesso, estaDesabilitado = false }: BotaoCopiarProps) {
  const [copiado, setCopiado] = useState(false);
  const [mostrarManual, setMostrarManual] = useState(false);
  const relogio = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(relogio.current), []);

  const copiar = async () => {
    if (!(await copiarTexto(texto))) {
      toast.erro('O navegador bloqueou a cópia. Selecione o código abaixo.');
      setMostrarManual(true);
      return;
    }
    toast.sucesso(mensagemSucesso);
    setCopiado(true);
    clearTimeout(relogio.current);
    relogio.current = setTimeout(() => setCopiado(false), TEMPO_CONFIRMACAO);
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.botao} ${copiado ? styles.botaoCopiado : ''}`}
        onClick={copiar}
        disabled={estaDesabilitado}
      >
        <span key={String(copiado)} className={styles.conteudo}>
          {copiado ? <Check size={20} aria-hidden="true" /> : <Copy size={20} aria-hidden="true" />}
          {copiado ? 'Copiado!' : rotulo}
        </span>
      </button>

      {mostrarManual && (
        <div className={styles.manual} role="dialog" aria-modal="true" aria-label="Copiar o código manualmente">
          <div className={styles.manualCaixa}>
            <button
              type="button"
              className={styles.manualFechar}
              aria-label="Fechar"
              onClick={() => setMostrarManual(false)}
            >
              <X size={20} aria-hidden="true" />
            </button>
            <h2 className={styles.manualTitulo}>Copie o código</h2>
            <textarea
              className={styles.manualTexto}
              readOnly
              autoFocus
              value={texto}
              onFocus={(evento) => evento.target.select()}
            />
          </div>
        </div>
      )}
    </>
  );
}
