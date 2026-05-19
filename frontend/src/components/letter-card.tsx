import type { PetLetter } from '../types/domain';
import { formatDate } from '../utils/format';

export function LetterCard({ letter }: { letter: PetLetter }) {
  return (
    <article className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,244,229,1),rgba(255,255,255,1))] p-6 shadow-[0_14px_40px_rgba(117,97,70,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-sage">
        Cartinha do pet
      </p>
      <h3 className="mt-3 font-display text-2xl text-brand-ink">{letter.title}</h3>
      <p className="mt-3 text-sm leading-7 text-brand-muted">{letter.content}</p>
      <p className="mt-5 text-sm text-brand-muted">{formatDate(letter.createdAt)}</p>
    </article>
  );
}
