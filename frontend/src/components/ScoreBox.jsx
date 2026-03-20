import { ScoreBadge } from './ScoreBadge';

export function ScoreBox({ score, analysis }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-lunar/80 p-5 shadow-glow backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Build Score</p>
          <p className="mt-2 text-2xl font-semibold text-white">Build snapshot</p>
        </div>
        <ScoreBadge score={score} />
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-200">
        {analysis.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}
