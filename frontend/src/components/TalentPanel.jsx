export function TalentPanel({ talents }) {
  return (
    <section className="rounded-[1.8rem] border border-white/[0.06] bg-[#171b2d]/90 p-4 shadow-glow backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9bed6]/55">Talents</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {talents.map((talent) => (
          <div className="text-center" key={talent.label}>
            <div className="flex flex-col items-center gap-2.5">
              <img
                alt={talent.label}
                className="h-20 w-20 rounded-full border border-white/[0.08] bg-[#1f5f5a]/28 object-cover p-1 sm:h-[88px] sm:w-[88px]"
                onError={(event) => {
                  event.currentTarget.src = 'https://placehold.co/112x112/090B13/F8FAFC?text=Talent';
                }}
                src={talent.icon}
              />
              <div>
                <p className="text-[15px] font-semibold text-white sm:text-base">{talent.label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400 sm:text-sm">Level {talent.level ?? '—'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
