function StatCell({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value ?? '—'}</p>
    </div>
  );
}

export function StatsGrid({ stats }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-lunar/80 p-5 shadow-glow backdrop-blur">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stats</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCell label="HP" value={stats.hp} />
        <StatCell label="ATK" value={stats.atk} />
        <StatCell label="DEF" value={stats.def} />
        <StatCell label="Elemental Mastery" value={stats.elemental_mastery} />
        <StatCell label="CRIT Rate" value={stats.crit_rate != null ? `${stats.crit_rate}%` : '—'} />
        <StatCell label="CRIT DMG" value={stats.crit_dmg != null ? `${stats.crit_dmg}%` : '—'} />
        <StatCell label="Energy Recharge" value={stats.energy_recharge != null ? `${stats.energy_recharge}%` : '—'} />
      </div>
    </section>
  );
}
