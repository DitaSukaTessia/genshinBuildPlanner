export function PlayerHeader({ player }) {
  if (!player) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-lunar/80 p-6 shadow-glow backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <img
            alt={player.nickname ?? 'Traveler'}
            className="h-20 w-20 rounded-full border border-white/10 object-cover shadow-glow"
            onError={(event) => {
              event.currentTarget.src = 'https://placehold.co/160x160/090B13/F8FAFC?text=Traveler';
            }}
            src={player.profile_picture}
          />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Player Profile</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{player.nickname ?? 'Unknown Traveler'}</h2>
            <p className="mt-1 text-sm text-slate-300">UID {player.uid}</p>
            {player.signature ? <p className="mt-2 max-w-xl text-sm text-slate-400">{player.signature}</p> : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Adventure Rank</p>
            <p className="mt-1 text-lg font-semibold text-white">AR {player.adventure_rank ?? '—'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">World Level</p>
            <p className="mt-1 text-lg font-semibold text-white">WL {player.world_level ?? '—'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Spiral Abyss</p>
            <p className="mt-1 text-lg font-semibold text-white">{player.spiral_abyss}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Imaginarium Theater</p>
            <p className="mt-1 text-lg font-semibold text-white">{player.imaginarium_theater}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
