export function ConstellationPanel({ constellations }) {
  return (
    <section className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.03] p-3">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9bed6]/55">Constellations</p>
      <div className="mt-3 flex flex-col gap-2.5">
        {constellations.map((constellation) => (
          <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-[#1f5f5a]/28 shadow-[0_10px_24px_rgba(25,116,103,0.18)] sm:h-[78px] sm:w-[78px]" key={constellation.label}>
            <img
              alt={constellation.label}
              className={`h-full w-full object-cover ${constellation.unlocked ? 'opacity-90' : 'opacity-20 grayscale'}`}
              onError={(event) => {
                event.currentTarget.src = 'https://placehold.co/96x96/090B13/F8FAFC?text=C';
              }}
              src={constellation.icon}
            />
            <span className="absolute inset-0 bg-gradient-to-br from-emerald-200/10 via-transparent to-[#04110f]/45" />
            <span className="absolute text-[2.25rem] font-semibold leading-none text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)] sm:text-[2.45rem]">
              {constellation.label.replace('C', '')}
            </span>
            {!constellation.unlocked ? (
              <span className="absolute inset-0 flex items-center justify-center text-2xl text-white/95">🔒</span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
