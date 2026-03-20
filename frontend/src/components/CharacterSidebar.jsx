export function CharacterSidebar({ characters, selectedCharacterName, onSelect }) {
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-lunar/80 p-4 shadow-glow backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Characters</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Focus one build</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {characters.length}
        </span>
      </div>

      <div className="max-h-[760px] space-y-3 overflow-y-auto pr-1">
        {characters.map((character) => {
          const isActive = character.name === selectedCharacterName;
          return (
            <button
              className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                isActive
                  ? 'border-star/50 bg-star/10 shadow-glow'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
              key={`${character.name}-${character.level}`}
              onClick={() => onSelect(character.name)}
              type="button"
            >
              <img
                alt={character.name}
                className="h-14 w-14 rounded-full border border-white/10 object-cover"
                onError={(event) => {
                  event.currentTarget.src = 'https://placehold.co/112x112/090B13/F8FAFC?text=Character';
                }}
                src={character.image}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-white">{character.name}</p>
                <p className="mt-1 text-sm text-slate-400">Lv. {character.level} • C{character.constellation}</p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
