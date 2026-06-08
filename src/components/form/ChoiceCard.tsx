interface ChoiceCardProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function ChoiceCard({ label, selected, onSelect }: ChoiceCardProps) {
  return (
    <button
      type="button"
      className={`choice-card${selected ? ' choice-card--selected' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="choice-card__radio" aria-hidden="true" />
      <span className="choice-card__label">{label}</span>
    </button>
  );
}