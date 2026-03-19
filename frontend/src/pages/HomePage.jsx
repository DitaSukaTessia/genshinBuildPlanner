import { useMemo, useState } from 'react';
import { BuildCard } from '../components/BuildCard';
import { CharacterCard } from '../components/CharacterCard';
import { CharacterSelect } from '../components/CharacterSelect';
import { UIDInput } from '../components/UIDInput';
import characterData from '../data/characters.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export function HomePage() {
  const [selectedName, setSelectedName] = useState(characterData[0]?.name ?? '');
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const selectedCharacter = useMemo(
    () => characterData.find((character) => character.name === selectedName) ?? characterData[0],
    [selectedName]
  );

  const handleAnalyze = async () => {
    const trimmedUid = uid.trim();
    if (!trimmedUid) {
      setError('Enter a UID to analyze.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/uid/${trimmedUid}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail ?? 'Unable to analyze this UID right now.');
      }

      setResult(payload);
    } catch (requestError) {
      setResult(null);
      setError(requestError.message || 'Unexpected error while analyzing UID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-abyss bg-radial-celestial text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-star/30 bg-star/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-star">
              Genshin Account Analyzer
            </div>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">
                Cleaner Genshin account analysis with mapped names, character art, and readable build scores.
              </h1>
              <p className="max-w-3xl text-base text-slate-300 md:text-lg">
                Analyze public UID showcases through the backend, then review each character in a responsive
                product-style card grid instead of raw Enka payload data.
              </p>
            </div>
          </div>
          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Official Enka data mapping</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Image-backed character cards</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Build scoring and analysis</div>
          </div>
        </header>

        <UIDInput error={error} loading={loading} onAnalyze={handleAnalyze} onChange={setUid} uid={uid} />

        {result ? (
          <section className="mt-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Player</p>
                <p className="mt-1 text-base font-medium text-white">{result.player?.nickname ?? 'Unknown Traveler'}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>UID {result.uid}</span>
                <span>AR {result.player?.level ?? '—'}</span>
                <span>WL {result.player?.world_level ?? '—'}</span>
                <span>{result.characters?.length ?? 0} characters</span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {result.characters.map((character) => (
                <CharacterCard character={character} key={`${character.name}-${character.weapon}`} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-10 rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-400">
            Enter a UID above to load account analysis cards.
          </section>
        )}

        <section className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-gold">Starter build planner</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Still need curated starter build guidance?</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                The project keeps the original MVP build planner so you can compare curated starter builds with live
                account analysis in the same app.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <CharacterSelect
                characters={characterData}
                value={selectedCharacter?.name ?? ''}
                onChange={setSelectedName}
              />
            </div>
          </div>

          <BuildCard character={selectedCharacter} />
        </section>
      </div>
    </main>
  );
}
