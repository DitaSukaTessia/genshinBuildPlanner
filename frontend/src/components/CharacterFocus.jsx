import { ConstellationPanel } from './ConstellationPanel';
import { ScoreBox } from './ScoreBox';

export function CharacterFocus({ character }) {
  return (
    <section className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#171b2d]/90 shadow-glow backdrop-blur">
      <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.9fr)]">
        <div className="overflow-hidden rounded-[1.8rem] border border-white/8 bg-gradient-to-br from-[#222742] via-[#111629] to-[#0a0d18]">
          <img
            alt={character.name}
            className="h-full min-h-[420px] w-full object-cover object-top"
            onError={(event) => {
              event.currentTarget.src = 'https://placehold.co/900x700/090B13/F8FAFC?text=Character';
            }}
            src={character.image}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_160px]">
          <div className="flex flex-col gap-5">
            <div className="rounded-[1.8rem] border border-white/8 bg-white/[0.04] p-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#b9bed6]/55">Character Focus</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">{character.name}</h2>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">Level {character.level}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                  Constellation {character.constellation}
                </span>
              </div>
            </div>

            <ScoreBox analysis={character.analysis} score={character.score} />
          </div>

          <ConstellationPanel constellations={character.constellations} />
        </div>
      </div>
    </section>
  );
}
