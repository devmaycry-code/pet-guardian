import type { NeedPriority, PetStatus } from '../types/domain';

interface SearchFilterBarProps {
  query: string;
  species: 'all' | 'dog' | 'cat';
  status: 'all' | PetStatus;
  urgency: 'all' | NeedPriority;
  onQueryChange: (value: string) => void;
  onSpeciesChange: (value: 'all' | 'dog' | 'cat') => void;
  onStatusChange: (value: 'all' | PetStatus) => void;
  onUrgencyChange: (value: 'all' | NeedPriority) => void;
}

export function SearchFilterBar(props: SearchFilterBarProps) {
  const inputClassName =
    'h-12 rounded-full border border-brand-line bg-white px-4 text-sm text-brand-ink outline-none transition focus:border-brand-sage';

  return (
    <div className="grid gap-3 rounded-[2rem] border border-brand-line bg-brand-panel p-4 md:grid-cols-4">
      <input
        className={inputClassName}
        placeholder="Busque por nome, cidade ou raca"
        value={props.query}
        onChange={(event) => props.onQueryChange(event.target.value)}
      />
      <select
        className={inputClassName}
        value={props.species}
        onChange={(event) => props.onSpeciesChange(event.target.value as 'all' | 'dog' | 'cat')}
      >
        <option value="all">Todas as especies</option>
        <option value="dog">Caes</option>
        <option value="cat">Gatos</option>
      </select>
      <select
        className={inputClassName}
        value={props.status}
        onChange={(event) => props.onStatusChange(event.target.value as 'all' | PetStatus)}
      >
        <option value="all">Todos os status</option>
        <option value="available">Apadrinhamento</option>
        <option value="adoption">Adocao</option>
        <option value="treatment">Tratamento</option>
        <option value="urgent">Urgente</option>
        <option value="temporary_home">Lar temporario</option>
      </select>
      <select
        className={inputClassName}
        value={props.urgency}
        onChange={(event) => props.onUrgencyChange(event.target.value as 'all' | NeedPriority)}
      >
        <option value="all">Todas as urgencias</option>
        <option value="critical">Critica</option>
        <option value="high">Alta</option>
        <option value="medium">Media</option>
        <option value="low">Baixa</option>
      </select>
    </div>
  );
}
