import { useState } from 'react';

export function WeaponCard({ weapon }) {
  const [showStats, setShowStats] = useState(false);

  return (
    <section className="relative rounded-[2rem] border border-white/10 bg-lunar/80 p-5 shadow-glow backdrop-blur">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Weapon</p>
      <button
        className="mt-4 flex w-full items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/20 hover:bg-white/10"
        onBlur={() => setShowStats(false)}
        onClick={() => setShowStats((current) => !current)}
        onMouseEnter={() => setShowStats(true)}
        onMouseLeave={() => setShowStats(false)}
        type="button"
      >
        <img
          alt={weapon.name}
          className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
          onError={(event) => {
            event.currentTarget.src = 'https://placehold.co/160x160/090B13/F8FAFC?text=Weapon';
          }}
          src={weapon.image}
        />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-white">{weapon.name}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-300">
            <span>Lv. {weapon.level ?? '—'}</span>
            <span>•</span>
            <span>R{weapon.refinement ?? '—'}</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">{weapon.main_stat ?? 'No secondary stat data'}</p>
        </div>
      </button>

      {showStats ? (
        <div className="absolute right-5 top-[calc(100%+0.75rem)] z-10 w-full max-w-sm rounded-[1.5rem] border border-white/10 bg-abyss/95 p-4 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Weapon Stats</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            {(weapon.stats?.length ? weapon.stats : ['No weapon stat data available.']).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
