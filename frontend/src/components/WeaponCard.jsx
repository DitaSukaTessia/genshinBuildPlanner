import { useState } from 'react';

export function WeaponCard({ weapon }) {
  const [showStats, setShowStats] = useState(false);

  return (
    <section
      className="relative rounded-[1.8rem] border border-white/[0.06] bg-[#171b2d]/90 p-4 shadow-glow backdrop-blur"
      onMouseEnter={() => setShowStats(true)}
      onMouseLeave={() => setShowStats(false)}
    >
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9bed6]/55">Weapon</p>
      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)]">
        <div className="flex items-center gap-3 rounded-[1.3rem] border border-white/[0.06] bg-white/[0.04] p-3.5">
          <img
            alt={weapon.name}
            className="h-16 w-16 rounded-[1.1rem] border border-white/[0.06] object-cover sm:h-[72px] sm:w-[72px]"
            onError={(event) => {
              event.currentTarget.src = 'https://placehold.co/160x160/090B13/F8FAFC?text=Weapon';
            }}
            src={weapon.image}
          />
          <div className="min-w-0">
            <p className="text-base font-semibold text-white sm:text-lg">{weapon.name}</p>
            <p className="mt-2 text-sm text-slate-400">{weapon.main_stat ?? 'No secondary stat data'}</p>
          </div>
        </div>

        <div className="rounded-[1.3rem] border border-white/[0.06] bg-white/[0.04] p-3.5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9bed6]/55">Level</p>
          <p className="mt-2.5 text-[2rem] font-semibold text-white">{weapon.level ?? '—'}</p>
          <p className="mt-2 text-sm text-slate-400">Hover or click the detail tile for stat breakdown.</p>
        </div>

        <button
          className="rounded-[1.3rem] border border-white/[0.06] bg-white/[0.04] p-3.5 text-left transition hover:border-star/30 hover:bg-white/[0.07]"
          onBlur={() => setShowStats(false)}
          onClick={() => setShowStats((current) => !current)}
          type="button"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9bed6]/55">Refinement</p>
          <p className="mt-2.5 text-[2rem] font-semibold text-white">R{weapon.refinement ?? '—'}</p>
          <p className="mt-2 text-sm text-slate-400">Open detailed weapon stats</p>
        </button>
      </div>

      {showStats ? (
        <div className="absolute inset-x-4 top-[calc(100%+0.75rem)] z-10 rounded-[1.3rem] border border-white/[0.06] bg-abyss/95 p-4 shadow-2xl xl:left-auto xl:right-4 xl:w-[320px]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9bed6]/55">Weapon Stats</p>
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
