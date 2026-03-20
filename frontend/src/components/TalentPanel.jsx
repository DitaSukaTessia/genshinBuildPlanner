export function TalentPanel({ talents }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-lunar/80 p-5 shadow-glow backdrop-blur">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Talents</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {talents.map((talent) => (
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4" key={talent.label}>
            <div className="flex items-center gap-3">
              <img
                alt={talent.label}
                className="h-14 w-14 rounded-xl border border-white/10 object-cover"
                onError={(event) => {
                  event.currentTarget.src = 'https://placehold.co/112x112/090B13/F8FAFC?text=Talent';
                }}
                src={talent.icon}
              />
              <div>
                <p className="text-sm font-semibold text-white">{talent.label}</p>
                <p className="mt-1 text-sm text-slate-400">Level {talent.level ?? '—'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
