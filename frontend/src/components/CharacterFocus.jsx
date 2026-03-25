import { ConstellationPanel } from './ConstellationPanel';
import { ScoreBox } from './ScoreBox';

export function CharacterFocus({ character }) {
  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-white/[0.06] bg-[#171b2d]/90 shadow-glow backdrop-blur sm:rounded-[2rem]">
      <div className="grid gap-3 p-3 sm:gap-4 sm:p-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
        <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-gradient-to-br from-[#222742] via-[#111629] to-[#0a0d18]">
          <img
            alt={character.name}
            className="h-full min-h-[240px] w-full object-cover object-top sm:min-h-[300px] md:min-h-[360px]"
            onError={(event) => {
              event.currentTarget.src = 'https://placehold.co/900x700/090B13/F8FAFC?text=Character';
            }}
            src={character.image}
          />
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-[minmax(0,1fr)_110px]">
          <div className="flex flex-col gap-4">
            <div className="rounded-[1.25rem] border border-white/[0.06] bg-white/[0.04] p-3.5 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#b9bed6]/55">Character Focus</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">{character.name}</h2>
              <div className="mt-3 flex flex-wrap gap-2.5 text-sm text-slate-200">
                <span className="rounded-full border border-white/[0.06] bg-white/[0.05] px-3.5 py-1.5">Level {character.level}</span>
                <span className="rounded-full border border-white/[0.06] bg-white/[0.05] px-3.5 py-1.5">
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
