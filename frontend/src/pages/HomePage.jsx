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
      <div className="mx-auto max-w-[1500px] px-5 py-8 xl:px-8">
        <header className="mb-6 space-y-4">
          <div className="inline-flex rounded-full border border-star/30 bg-star/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-star">
            Genshin Account Analyzer
          </div>
          <div className="space-y-3">
            <h1 className="max-w-5xl text-4xl font-semibold leading-tight md:text-5xl">
              Match the showcase layout with a focused character dashboard.
            </h1>
            <p className="max-w-4xl text-base text-slate-300 md:text-lg">
              Pick a character from the sidebar, inspect numbered constellations with lock states, then review talents,
              weapon detail popovers, stats, and artifact slots in the same layout style as the provided design.
            </p>
          </div>
        </header>

        <UIDInput error={error} loading={loading} onAnalyze={handleAnalyze} onChange={setUid} uid={uid} />

        {result ? (
          <div className="mt-8 space-y-6">
            <PlayerHeader player={result.player} />

            <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
              <CharacterSidebar
                characters={result.characters}
                onSelect={setSelectedCharacterName}
                selectedCharacterName={selectedCharacter?.name ?? ''}
              />
              <CharacterDetail character={selectedCharacter} />
            </section>
          </div>
        ) : (
          <section className="mt-8 rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
            Enter a UID above to load the player header, browse the sidebar, and focus the analyzer on a single build.
          </section>
        )}
      </div>
    </main>
  );
}
