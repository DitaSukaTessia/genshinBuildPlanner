export function UIDInput({ uid, loading, error, onChange, onAnalyze }) {
  return (
    <section className="rounded-[1.8rem] border border-white/[0.06] bg-[#171b2d]/90 p-4 shadow-glow backdrop-blur sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold/80">Analyze UID</p>
          <h2 className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">Load a public showcase and inspect one build at a time.</h2>
          <p className="text-sm text-slate-300">
            Character names and images now fall back more safely when Enka localization is incomplete.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
          <input
            className="min-w-0 flex-1 rounded-[1.2rem] border border-white/[0.06] bg-abyss/85 px-4 py-3 text-white outline-none transition focus:border-star focus:ring-2 focus:ring-star/30"
            onChange={(event) => onChange(event.target.value)}
            placeholder="Enter UID"
            value={uid}
          />
          <button
            className="rounded-[1.2rem] border border-star/30 bg-star/15 px-5 py-3 font-medium text-white transition hover:bg-star/25 disabled:cursor-not-allowed disabled:opacity-70"
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
