import { useMemo, useState } from 'react';

function ArtifactModal({ artifact, onClose }) {
  if (!artifact) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-abyss/75 p-4" onClick={onClose} role="presentation">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/[0.06] bg-lunar p-6 shadow-2xl" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{artifact.slot}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{artifact.name}</h3>
            <p className="mt-2 text-sm text-slate-400">{artifact.set_name}</p>
          </div>
          <button className="rounded-full border border-white/[0.06] px-3 py-1 text-sm text-slate-300" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <img
            alt={artifact.name}
            className="h-24 w-24 rounded-2xl border border-white/[0.06] object-cover"
            onError={(event) => {
              event.currentTarget.src = 'https://placehold.co/192x192/090B13/F8FAFC?text=Artifact';
            }}
            src={artifact.image}
          />
          <div>
            <p className="text-sm text-slate-300">Level +{artifact.level ?? 0}</p>
            <p className="mt-2 text-base font-semibold text-white">{artifact.main_stat ?? 'No main stat data'}</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Substats</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            {(artifact.substats?.length ? artifact.substats : ['No substat data available.']).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ArtifactPanel({ artifacts, artifactSets, artifactCount }) {
  const [selectedArtifactName, setSelectedArtifactName] = useState('');

  const selectedArtifact = useMemo(
    () => artifacts.find((artifact) => artifact.name === selectedArtifactName) ?? null,
    [artifacts, selectedArtifactName]
  );

  return (
    <>
      <section className="rounded-[1.8rem] border border-white/[0.06] bg-[#171b2d]/90 p-4 shadow-glow backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9bed6]/55">Artifacts</p>
            <p className="mt-2 text-sm text-slate-400">Click a slot to inspect details.</p>
          </div>
          <div className="rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            {artifactCount ?? artifacts.length} equipped
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-between gap-3">
          {artifacts.map((artifact) => (
            <button
              className="flex flex-col items-center gap-2.5 rounded-[1.6rem] border border-white/[0.06] bg-white/[0.04] p-2.5 transition hover:border-white/15 hover:bg-white/[0.08]"
              key={`${artifact.slot}-${artifact.name}`}
              onClick={() => setSelectedArtifactName(artifact.name)}
              type="button"
            >
              <img
                alt={artifact.slot}
                className="h-16 w-16 rounded-full border border-white/[0.06] object-cover sm:h-[72px] sm:w-[72px]"
                onError={(event) => {
                  event.currentTarget.src = 'https://placehold.co/128x128/090B13/F8FAFC?text=Artifact';
                }}
                src={artifact.image}
              />
              <span className="text-xs uppercase tracking-[0.15em] text-slate-300">{artifact.slot}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {artifactSets.length ? (
            artifactSets.map((setInfo) => (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3" key={setInfo.name}>
                <p className="text-sm font-semibold text-white">{setInfo.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{setInfo.count}-piece</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-white/5 px-4 py-3 text-sm text-slate-300">
              No artifact set data available.
            </div>
          )}
        </div>
      </section>

      <ArtifactModal artifact={selectedArtifact} onClose={() => setSelectedArtifactName('')} />
    </>
  );
}
