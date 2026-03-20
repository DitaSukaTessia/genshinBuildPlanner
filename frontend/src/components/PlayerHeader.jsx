export function PlayerHeader({ player }) {
  if (!player) {
    return null;
  }

  return (
    <section className="rounded-[2.2rem] border border-white/10 bg-[#171b2d]/90 p-6 shadow-glow backdrop-blur">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <img
            alt={player.nickname ?? 'Traveler'}
            className="h-20 w-20 rounded-full border border-white/10 bg-abyss object-cover shadow-glow"
            onError={(event) => {
              event.currentTarget.src = 'https://placehold.co/160x160/090B13/F8FAFC?text=Traveler';
            }}
            src={player.profile_picture}
          />
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9bed6]/55">Player Profile</p>
            <h2 className="mt-2 text-[2rem] font-semibold tracking-tight text-white">{player.nickname ?? 'Unknown Traveler'}</h2>
            <p className="mt-1 text-base text-slate-300">UID {player.uid}</p>
            {player.signature ? <p className="mt-2 max-w-xl text-base text-slate-400">{player.signature}</p> : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9bed6]/55">Adventure Rank</p>
            <p className="mt-2 text-[1.7rem] font-semibold tracking-tight text-white">AR {player.adventure_rank ?? '—'}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9bed6]/55">World Level</p>
            <p className="mt-2 text-[1.7rem] font-semibold tracking-tight text-white">WL {player.world_level ?? '—'}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9bed6]/55">Spiral Abyss</p>
            <p className="mt-2 text-[1.7rem] font-semibold tracking-tight text-white">{player.spiral_abyss}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9bed6]/55">Imaginarium Theater</p>
            <p className="mt-2 text-[1.7rem] font-semibold tracking-tight text-white">{player.imaginarium_theater}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
