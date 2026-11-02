import styles from './style.module.css';

const LIMITE_FRASE = 140;

interface CampoFraseProps {
  frase: string;
  aoMudar: (frase: string) => void;
}

export default function CampoFrase({ frase, aoMudar }: CampoFraseProps) {
  return (
    <input
      className={styles.campo}
      type="text"
      aria-label="Sua frase"
      placeholder="Digite sua frase"
      maxLength={LIMITE_FRASE}
      value={frase}
      onChange={(evento) => aoMudar(evento.target.value)}
    />
  );
}
