import { useState } from 'react';

function StatPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}

function ScoreBadge({ score }) {
  const tone =
    score >= 85
      ? 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10'
      : score >= 70
        ? 'text-gold border-gold/30 bg-gold/10'
        : 'text-rose-300 border-rose-400/30 bg-rose-500/10';

  return (
    <div className={`rounded-full border px-4 py-2 text-sm font-semibold ${tone}`}>
      Build Score: {score}/100
    </div>
  );
}

function CharacterAnalysisCard({ character }) {
  const stats = character.stats ?? {};

  return (
    <article className="rounded-3xl border border-white/10 bg-lunar/80 p-5 shadow-glow backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-star">UID Character Analysis</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{character.name}</h3>
          <p className="mt-2 text-sm text-slate-300">
            Level {character.level} • {character.weapon}
          </p>
        </div>
        <ScoreBadge score={character.score} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatPill label="ATK" value={stats.atk ?? '—'} />
        <StatPill label="CRIT Rate" value={stats.crit_rate != null ? `${stats.crit_rate}%` : '—'} />
        <StatPill label="CRIT DMG" value={stats.crit_dmg != null ? `${stats.crit_dmg}%` : '—'} />
        <StatPill label="ER" value={stats.energy_recharge != null ? `${stats.energy_recharge}%` : '—'} />
        <StatPill label="EM" value={stats.elemental_mastery ?? '—'} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-xs uppercase tracking-[0.18em] text-slate-400">Artifact Sets</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {(character.artifact_sets?.length ? character.artifact_sets : ['No artifact data']).map(
              (setName) => (
                <span
                  className="rounded-full border border-star/30 bg-star/10 px-3 py-2 text-sm text-blue-100"
                  key={setName}
                >
                  {setName}
                </span>
              )
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-xs uppercase tracking-[0.18em] text-slate-400">Analysis</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            {character.analysis.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export function UidAnalyzer() {
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

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
    <section className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Enka.Network UID Fetch</p>
          <h2 className="text-3xl font-semibold text-white">Analyze public showcase builds from a UID</h2>
          <p className="text-slate-300">
            Enter a public Genshin UID to fetch characters, simplify their stats, and score each build
            using the backend analysis service.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
          <input
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-abyss/80 px-4 py-3 text-white outline-none transition focus:border-star focus:ring-2 focus:ring-star/30"
            placeholder="Enter UID"
            value={uid}
            onChange={(event) => setUid(event.target.value)}
          />
          <button
            className="rounded-2xl border border-star/40 bg-star/15 px-5 py-3 font-medium text-white transition hover:bg-star/25 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
            onClick={handleAnalyze}
            type="button"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-abyss/60 px-4 py-3 text-sm text-slate-300">
            <span>UID {result.uid}</span>
            <span>Showcase cache TTL: {result.ttl ?? 'Unknown'}s</span>
            <span>Characters found: {result.characters?.length ?? 0}</span>
          </div>

          <div className="grid gap-4">
            {result.characters.map((character) => (
              <CharacterAnalysisCard character={character} key={`${character.name}-${character.weapon}`} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
