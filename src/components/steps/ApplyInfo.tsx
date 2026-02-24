import StepHeader from '../ui/StepHeader'
import SummaryPanel from '../ui/SummaryPanel'
import type { Candidate, Job } from '../../types'

type Props = {
  candidate: Candidate | null
  selectedJob: Job | null
  repoUrl: string
}

export default function ApplyInfo({ candidate, selectedJob, repoUrl }: Props) {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <StepHeader
        title="Paso 4 · Revisar y enviar"
        description="Revisá la información antes del envío final."
      />
      <SummaryPanel candidate={candidate} selectedJob={selectedJob} repoUrl={repoUrl} />
    </div>
  )
}


