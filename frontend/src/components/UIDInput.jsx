export function UIDInput({ uid, loading, error, onChange, onAnalyze }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#171b2d]/90 p-5 shadow-glow backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold/80">Analyze UID</p>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Load a public showcase and inspect one build at a time.</h2>
          <p className="text-sm text-slate-300">
            Character names and images now fall back more safely when Enka localization is incomplete.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
          <input
            className="min-w-0 flex-1 rounded-[1.35rem] border border-white/10 bg-abyss/85 px-4 py-3 text-white outline-none transition focus:border-star focus:ring-2 focus:ring-star/30"
            onChange={(event) => onChange(event.target.value)}
            placeholder="Enter UID"
            value={uid}
          />
          <button
            className="rounded-[1.35rem] border border-star/40 bg-star/15 px-5 py-3 font-medium text-white transition hover:bg-star/25 disabled:cursor-not-allowed disabled:opacity-70"
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
