import { Search } from 'lucide-react';
import styles from './style.module.css';

interface CampoBuscaProps {
  valor: string;
  rotulo: string;
  aoMudar: (valor: string) => void;
}

export default function CampoBusca({ valor, rotulo, aoMudar }: CampoBuscaProps) {
  return (
    <label className={styles.campo}>
      <Search size={18} aria-hidden="true" />
      <input
        className={styles.entrada}
        type="search"
        placeholder={rotulo}
        aria-label={rotulo}
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
      />
    </label>
  );
}
