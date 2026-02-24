import type { Candidate, Job } from '../../types'

type Props = {
  candidate: Candidate | null
  selectedJob: Job | null
  repoUrl: string
}

export default function SummaryPanel({ candidate, selectedJob, repoUrl }: Props) {
  const candidateLabel = candidate ? `${candidate.firstName} ${candidate.lastName}`.trim() : ''

  return (
    <div className="grid gap-2 border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      {candidateLabel ? (
        <div>
          <span className="font-semibold text-slate-900">Candidato:</span> {candidateLabel}
        </div>
      ) : null}
      {candidate?.uuid ? (
        <div>
          <span className="font-semibold text-slate-900">UUID:</span> {candidate.uuid}
        </div>
      ) : null}
      {candidate?.candidateId ? (
        <div>
          <span className="font-semibold text-slate-900">Candidate ID:</span> {candidate.candidateId}
        </div>
      ) : null}
      {selectedJob ? (
        <div>
          <span className="font-semibold text-slate-900">Posición:</span> {`${selectedJob.title} (${selectedJob.id})`}
        </div>
      ) : null}
      {repoUrl.trim() ? (
        <div>
          <span className="font-semibold text-slate-900">Repo URL:</span> {repoUrl}
        </div>
      ) : null}
    </div>
  )
}

