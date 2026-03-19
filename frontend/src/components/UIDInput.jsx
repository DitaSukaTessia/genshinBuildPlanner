export function UIDInput({ uid, loading, error, onChange, onAnalyze }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-lunar/80 p-6 shadow-glow backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Genshin Account Analyzer</p>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Analyze public UID showcases with cleaner names, images, and build scoring.
          </h2>
          <p className="text-slate-300">
            Enter a public UID to fetch character builds, resolve readable names from the official Enka dataset,
            and score each build in a clean card layout.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
          <input
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-abyss/85 px-4 py-3 text-white outline-none transition focus:border-star focus:ring-2 focus:ring-star/30"
            onChange={(event) => onChange(event.target.value)}
            placeholder="Enter UID"
            value={uid}
          />
          <button
            className="rounded-2xl border border-star/40 bg-star/15 px-5 py-3 font-medium text-white transition hover:bg-star/25 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
            onClick={onAnalyze}
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
    </section>
  );
}
