export function CharacterSidebar({ characters, selectedCharacterName, onSelect }) {
  return (
    <aside className="rounded-[1.6rem] border border-white/[0.06] bg-[#171b2d]/90 p-3 shadow-glow backdrop-blur sm:rounded-[2rem] sm:p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9bed6]/55">Characters</p>
          <h3 className="mt-1.5 text-lg font-semibold text-white sm:mt-2 sm:text-xl">Focus one build</h3>
        </div>
        <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
          {characters.length}
        </span>
      </div>

      <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1 sm:max-h-[720px] sm:space-y-2.5">
        {characters.map((character) => {
          const isActive = character.name === selectedCharacterName;
          return (
            <button
              className={`flex w-full items-center gap-3 rounded-[1.35rem] border px-3 py-2.5 text-left transition ${
                isActive
                  ? 'border-star/50 bg-[#232a44] shadow-glow'
                  : 'border-white/[0.06] bg-white/[0.04] hover:border-white/15 hover:bg-white/[0.08]'
              }`}
              key={`${character.name}-${character.level}`}
              onClick={() => onSelect(character.name)}
              type="button"
            >
              <img
                alt={character.name}
                className="h-12 w-12 rounded-full border border-white/[0.06] object-cover"
                onError={(event) => {
                  event.currentTarget.src = 'https://placehold.co/112x112/090B13/F8FAFC?text=Character';
                }}
                src={character.image}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-white">{character.name}</p>
                <p className="mt-1 text-sm text-slate-400">Lv. {character.level} • C{character.constellation}</p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
