import type { TimelinePost } from '../types/domain';
import { formatDate } from '../utils/format';

export function TimelineCard({ post }: { post: TimelinePost }) {
  return (
    <article className="rounded-[1.75rem] border border-brand-line bg-brand-panel p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-sage">
        {post.type}
      </p>
      <h3 className="mt-2 font-display text-2xl text-brand-ink">{post.title}</h3>
      <p className="mt-3 text-sm leading-6 text-brand-muted">{post.content}</p>
      <p className="mt-4 text-sm text-brand-muted">{formatDate(post.createdAt)}</p>
    </article>
  );
}
