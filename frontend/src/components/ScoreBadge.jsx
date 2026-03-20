export function ScoreBadge({ score }) {
  const tone =
    score >= 85
      ? 'border-emerald-400/35 bg-emerald-500/10 text-emerald-200'
      : score >= 70
        ? 'border-gold/35 bg-gold/10 text-gold'
        : 'border-rose-400/35 bg-rose-500/10 text-rose-200';

  return (
    <span className={`inline-flex rounded-full border px-3 py-2 text-sm font-semibold whitespace-nowrap ${tone}`}>
      Score {score}/100
    </span>
  );
}
