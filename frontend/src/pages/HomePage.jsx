import { useEffect, useMemo, useState } from 'react';
import { CharacterDetail } from '../components/CharacterDetail';
import { CharacterSidebar } from '../components/CharacterSidebar';
import { PlayerHeader } from '../components/PlayerHeader';
import { UIDInput } from '../components/UIDInput';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export function HomePage() {
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [selectedCharacterName, setSelectedCharacterName] = useState('');

  useEffect(() => {
    const firstCharacterName = result?.characters?.[0]?.name ?? '';
    setSelectedCharacterName(firstCharacterName);
  }, [result]);

  const selectedCharacter = useMemo(() => {
    if (!result?.characters?.length) {
      return null;
    }

    return (
      result.characters.find((character) => character.name === selectedCharacterName) ?? result.characters[0]
    );
  }, [result, selectedCharacterName]);

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
      <div className="mx-auto max-w-[1100px] px-3 py-4 sm:px-4 sm:py-5 xl:px-6">
        <header className="mb-4 space-y-2.5 sm:mb-5 sm:space-y-3">
          <div className="inline-flex rounded-full border border-star/30 bg-star/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-star">
            Genshin Account Analyzer
          </div>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
              Match the showcase layout with a focused character dashboard.
            </h1>
            <p className="max-w-3xl text-xs text-slate-300 sm:text-sm md:text-base">
              Pick a character from the sidebar, inspect numbered constellations with lock states, then review talents,
              weapon detail popovers, stats, and artifact slots in the same layout style as the provided design.
            </p>
          </div>
        </header>

        <UIDInput error={error} loading={loading} onAnalyze={handleAnalyze} onChange={setUid} uid={uid} />

        {result ? (
          <div className="mt-5 space-y-4 sm:space-y-5">
            <PlayerHeader player={result.player} />

            <section className="grid gap-4 sm:gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
              <CharacterSidebar
                characters={result.characters}
                onSelect={setSelectedCharacterName}
                selectedCharacterName={selectedCharacter?.name ?? ''}
              />
              <CharacterDetail character={selectedCharacter} />
            </section>
          </div>
        ) : (
          <section className="mt-8 rounded-[2rem] border border-dashed border-white/[0.06] bg-white/5 p-10 text-center text-slate-400">
            Enter a UID above to load the player header, browse the sidebar, and focus the analyzer on a single build.
          </section>
        )}
      </div>
    </main>
  );
}
