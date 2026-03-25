export function PlayerHeader({ player }) {
  if (!player) {
    return null;
  }

  return (
    <section className="rounded-[1.6rem] border border-white/[0.06] bg-[#171b2d]/90 p-3.5 shadow-glow backdrop-blur sm:rounded-[2rem] sm:p-5">
      <div className="flex flex-col gap-3.5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <img
            alt={player.nickname ?? 'Traveler'}
            className="h-16 w-16 rounded-full border border-white/[0.06] bg-abyss object-cover shadow-glow sm:h-[72px] sm:w-[72px]"
            onError={(event) => {
              event.currentTarget.src = 'https://placehold.co/160x160/090B13/F8FAFC?text=Traveler';
            }}
            src={player.profile_picture}
          />
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9bed6]/55">Player Profile</p>
            <h2 className="mt-1 text-[1.4rem] font-semibold tracking-tight text-white sm:mt-1.5 sm:text-[1.8rem]">{player.nickname ?? 'Unknown Traveler'}</h2>
            <p className="mt-1 text-sm text-slate-300 sm:text-base">UID {player.uid}</p>
            {player.signature ? <p className="mt-1.5 max-w-xl text-sm text-slate-400 sm:text-base">{player.signature}</p> : null}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[1.25rem] border border-white/[0.06] bg-white/[0.04] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9bed6]/55">Adventure Rank</p>
            <p className="mt-1.5 text-[1.45rem] font-semibold tracking-tight text-white">AR {player.adventure_rank ?? '—'}</p>
          </div>
          <div className="rounded-[1.25rem] border border-white/[0.06] bg-white/[0.04] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9bed6]/55">World Level</p>
            <p className="mt-1.5 text-[1.45rem] font-semibold tracking-tight text-white">WL {player.world_level ?? '—'}</p>
          </div>
          <div className="rounded-[1.25rem] border border-white/[0.06] bg-white/[0.04] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9bed6]/55">Spiral Abyss</p>
            <p className="mt-1.5 text-[1.45rem] font-semibold tracking-tight text-white">{player.spiral_abyss}</p>
          </div>
          <div className="rounded-[1.25rem] border border-white/[0.06] bg-white/[0.04] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9bed6]/55">Imaginarium Theater</p>
            <p className="mt-1.5 text-[1.45rem] font-semibold tracking-tight text-white">{player.imaginarium_theater}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
