import { ScoreBadge } from './ScoreBadge';

export function ScoreBox({ score, analysis }) {
  return (
    <section className="rounded-[1.8rem] border border-white/8 bg-white/[0.04] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9bed6]/55">Score</p>
          <p className="mt-2 text-2xl font-semibold text-white">Build snapshot</p>
        </div>
        <ScoreBadge score={score} />
      </div>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-200">
        {(analysis?.length ? analysis : ['No build analysis available yet.']).map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}
