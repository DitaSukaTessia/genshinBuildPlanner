export function ConstellationPanel({ constellations }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-lunar/80 p-5 shadow-glow backdrop-blur">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Constellations</p>
      <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
        {constellations.map((constellation) => (
          <div className="relative flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3" key={constellation.label}>
            <img
              alt={constellation.label}
              className={`h-12 w-12 rounded-full object-cover ${constellation.unlocked ? '' : 'opacity-35 grayscale'}`}
              onError={(event) => {
                event.currentTarget.src = 'https://placehold.co/96x96/090B13/F8FAFC?text=C';
              }}
              src={constellation.icon}
            />
            {!constellation.unlocked ? (
              <span className="absolute inset-0 flex items-center justify-center text-xl text-white/90">🔒</span>
            ) : null}
            <span className="text-xs font-medium text-slate-300">{constellation.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
