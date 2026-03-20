function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</dt>
      <dd className="mt-2 text-lg font-semibold text-white">{value}</dd>
    </div>
  );
}

export function BuildCard({ character }) {
  if (!character) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-lunar/80 p-6 shadow-glow backdrop-blur">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-star">Recommended build</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{character.name}</h2>
        </div>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-gold">
          MVP data
        </span>
      </div>

      <dl className="grid gap-4 md:grid-cols-2">
        <DetailItem label="Weapon" value={character.weapon} />
        <DetailItem label="Artifact Set" value={character.artifact} />
      </dl>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400">Main stat priority</h3>
        <ul className="mt-3 flex flex-wrap gap-3">
          {character.main_stats.map((stat) => (
            <li
              className="rounded-full border border-star/30 bg-star/10 px-4 py-2 text-sm font-medium text-blue-100"
              key={stat}
            >
              {stat}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
