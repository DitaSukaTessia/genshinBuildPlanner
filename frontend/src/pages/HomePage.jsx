import { useMemo, useState } from 'react';
import { BuildCard } from '../components/BuildCard';
import { CharacterSelect } from '../components/CharacterSelect';
import characterData from '../data/characters.json';

export function HomePage() {
  const [selectedName, setSelectedName] = useState(characterData[0]?.name ?? '');

  const selectedCharacter = useMemo(
    () => characterData.find((character) => character.name === selectedName) ?? characterData[0],
    [selectedName]
  );

  return (
    <main className="min-h-screen bg-abyss bg-radial-celestial text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <section className="space-y-6">
            <div className="inline-flex rounded-full border border-star/30 bg-star/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-star">
              Genshin Build Planner
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Plan cleaner, faster character builds for your next abyss run.
              </h1>
              <p className="max-w-xl text-base text-slate-300 md:text-lg">
                Start with curated build recommendations today, then extend this starter into UID import,
                AI-powered analysis, and full account features later.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <CharacterSelect
                characters={characterData}
                value={selectedCharacter?.name ?? ''}
                onChange={setSelectedName}
              />
            </div>

            <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">JSON-backed data source</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">FastAPI-ready backend</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Future AI extension points</div>
            </div>
          </section>

          <BuildCard character={selectedCharacter} />
        </div>
      </div>
    </main>
  );
}
