import { ScoreBadge } from './ScoreBadge';

function DetailBlock({ title, children, className = '' }) {
  return (
    <section className={`rounded-[2rem] border border-white/10 bg-lunar/80 p-5 shadow-glow backdrop-blur ${className}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value ?? '—'}</p>
    </div>
  );
}

function TalentPill({ label, value }) {
  return (
    <div className="rounded-full border border-star/30 bg-star/10 px-4 py-2 text-sm text-blue-100">
      {label}: {value ?? '—'}
    </div>
  );
}

export function CharacterDetail({ character }) {
  if (!character) {
    return null;
  }

  const artifactSets = character.artifact_sets?.length ? character.artifact_sets : [];

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-lunar/80 shadow-glow backdrop-blur">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="min-h-[320px] bg-gradient-to-br from-star/15 via-lunar to-abyss">
            <img
              alt={character.name}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = 'https://placehold.co/900x700/090B13/F8FAFC?text=Character';
              }}
              src={character.image}
            />
          </div>

          <div className="flex flex-col justify-between gap-6 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Character Focus</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">{character.name}</h2>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Level {character.level}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Constellation {character.constellation}</span>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Score</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Build snapshot</p>
                </div>
                <ScoreBadge score={character.score} />
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                {character.analysis.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <DetailBlock title="Weapon">
          <div className="grid gap-3 md:grid-cols-3">
            <StatRow label="Name" value={character.weapon?.name} />
            <StatRow label="Level" value={character.weapon?.level ? `Lv. ${character.weapon.level}` : '—'} />
            <StatRow label="Main Stat" value={character.weapon?.main_stat} />
          </div>
        </DetailBlock>

        <DetailBlock title="Talents">
          <div className="flex flex-wrap gap-3">
            <TalentPill label="NA" value={character.talents?.normal_attack} />
            <TalentPill label="Skill" value={character.talents?.skill} />
            <TalentPill label="Burst" value={character.talents?.burst} />
          </div>
        </DetailBlock>
      </div>

      <DetailBlock title="Stats">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatRow label="HP" value={character.stats.hp} />
          <StatRow label="ATK" value={character.stats.atk} />
          <StatRow label="DEF" value={character.stats.def} />
          <StatRow label="Elemental Mastery" value={character.stats.elemental_mastery} />
          <StatRow label="CRIT Rate" value={character.stats.crit_rate != null ? `${character.stats.crit_rate}%` : '—'} />
          <StatRow label="CRIT DMG" value={character.stats.crit_dmg != null ? `${character.stats.crit_dmg}%` : '—'} />
          <StatRow
            label="Energy Recharge"
            value={character.stats.energy_recharge != null ? `${character.stats.energy_recharge}%` : '—'}
          />
        </div>
      </DetailBlock>

      <DetailBlock title="Artifacts">
        <div className="flex flex-wrap gap-3">
          {artifactSets.length ? (
            artifactSets.map((setInfo) => (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" key={setInfo.name}>
                <p className="text-sm font-semibold text-white">{setInfo.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{setInfo.count}-piece</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              No artifact data available.
            </div>
          )}
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-sm font-semibold text-white">Artifacts Equipped</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{character.artifact_count ?? 0} pieces</p>
          </div>
        </div>
      </DetailBlock>
    </div>
  );
}
