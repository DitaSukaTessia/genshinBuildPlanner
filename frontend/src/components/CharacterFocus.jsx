export function CharacterFocus({ character }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-lunar/80 shadow-glow backdrop-blur">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="min-h-[360px] bg-gradient-to-br from-star/15 via-lunar to-abyss">
          <img
            alt={character.name}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = 'https://placehold.co/900x700/090B13/F8FAFC?text=Character';
            }}
            src={character.image}
          />
        </div>

        <div className="flex flex-col justify-end gap-6 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Character Focus</p>
            <h2 className="mt-3 text-4xl font-semibold text-white">{character.name}</h2>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Level {character.level}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Constellation C{character.constellation}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
