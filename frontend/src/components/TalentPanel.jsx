export function TalentPanel({ talents }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#171b2d]/90 p-5 shadow-glow backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9bed6]/55">Talents</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {talents.map((talent) => (
          <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4 text-center" key={talent.label}>
            <div className="flex flex-col items-center gap-3">
              <img
                alt={talent.label}
                className="h-20 w-20 rounded-full border border-emerald-300/25 bg-[#1f5f5a]/35 object-cover p-1"
                onError={(event) => {
                  event.currentTarget.src = 'https://placehold.co/112x112/090B13/F8FAFC?text=Talent';
                }}
                src={talent.icon}
              />
              <div>
                <p className="text-base font-semibold text-white">{talent.label}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-slate-400">Level {talent.level ?? '—'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
