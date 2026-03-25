function StatCell({ label, value }) {
  return (
    <div className="rounded-[1.4rem] border border-white/[0.06] bg-white/[0.04] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#b9bed6]/55">{label}</p>
      <p className="mt-2 text-[1.55rem] font-semibold tracking-tight text-white">{value ?? '—'}</p>
    </div>
  );
}

export function StatsGrid({ stats }) {
  return (
    <section className="rounded-[1.8rem] border border-white/[0.06] bg-[#171b2d]/90 p-4 shadow-glow backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9bed6]/55">Stats</p>
      <div className="mt-3 grid gap-2 sm:mt-4 sm:gap-2.5 md:grid-cols-2 xl:grid-cols-4">
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
