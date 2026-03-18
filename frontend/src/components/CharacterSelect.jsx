export function CharacterSelect({ characters, value, onChange }) {
  return (
    <label className="flex flex-col gap-3 text-sm text-slate-300">
      <span className="font-medium uppercase tracking-[0.2em] text-gold">Choose a character</span>
      <select
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-star focus:ring-2 focus:ring-star/30"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {characters.map((character) => (
          <option className="bg-lunar" key={character.name} value={character.name}>
            {character.name}
          </option>
        ))}
      </select>
    </label>
  );
}
