function ScoreBadge({ score }) {
  const tone =
    score >= 85
      ? 'border-emerald-400/35 bg-emerald-500/10 text-emerald-200'
      : score >= 70
        ? 'border-gold/35 bg-gold/10 text-gold'
        : 'border-rose-400/35 bg-rose-500/10 text-rose-200';

  return (
    <span className={`inline-flex rounded-full border px-3 py-2 text-sm font-semibold ${tone}`}>
      {score}/100
    </span>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}

export function CharacterCard({ character }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-lunar/85 shadow-glow backdrop-blur">
      <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-star/15 via-lunar to-abyss">
        <img
          alt={character.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = 'https://placehold.co/640x400/090B13/F8FAFC?text=Genshin+Character';
          }}
          src={character.image}
        />
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-white">{character.name}</h3>
            <p className="mt-1 text-sm text-slate-300">Level {character.level}</p>
            <p className="mt-2 text-sm text-slate-400">Weapon: {character.weapon}</p>
          </div>
          <ScoreBadge score={character.score} />
        </div>

        <dl className="grid grid-cols-3 gap-3">
          <StatItem label="CRIT Rate" value={character.stats.crit_rate != null ? `${character.stats.crit_rate}%` : '—'} />
          <StatItem label="CRIT DMG" value={character.stats.crit_dmg != null ? `${character.stats.crit_dmg}%` : '—'} />
          <StatItem label="ATK" value={character.stats.atk ?? '—'} />
        </dl>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Artifact Sets</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(character.artifact_sets?.length ? character.artifact_sets : ['No artifact data']).map((setName) => (
              <span className="rounded-full border border-star/30 bg-star/10 px-3 py-2 text-sm text-blue-100" key={setName}>
                {setName}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Analysis</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            {character.analysis.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
