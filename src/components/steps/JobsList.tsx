import type { Job } from '../../types'
import StepHeader from '../ui/StepHeader'

type Candidate = {
  uuid: string
  candidateId: string
}

type Props = {
  jobs: Job[]
  jobsLoading: boolean
  jobsError: string | null
  candidate: Candidate | null
  selectedJobId: string | null
  onSelect: (job: Job) => void
}

export default function JobsList({ jobs, jobsLoading, jobsError, candidate, selectedJobId, onSelect }: Props) {
  return (
    <div className="grid gap-6">
      <StepHeader
        title="Paso 2 · Posiciones abiertas"
        description="Seleccioná una posición para continuar."
      />

      {jobsLoading ? (
        <div className="border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          Cargando posiciones...
        </div>
      ) : null}

      {jobsError ? (
        <div className="border border-rose-300 bg-rose-50 px-4 py-6 text-sm text-rose-700">{jobsError}</div>
      ) : null}

      {!jobsLoading && !jobsError && jobs.length === 0 ? (
        <div className="border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          No hay posiciones disponibles por el momento.
        </div>
      ) : null}

      <div className="grid gap-4">
        {jobs.map((job) => {
          const isSelected = selectedJobId === job.id
          return (
            <div key={job.id} className="grid gap-4 border border-slate-200 bg-slate-50 p-5 text-center">
              <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Posición</p>
                <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                <p className="text-sm text-slate-600">ID: {job.id}</p>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => onSelect(job)}
                  className={`inline-flex items-center justify-center border px-4 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isSelected ? 'Seleccionada' : 'Seleccionar esta oferta'}
                </button>
              </div>

              {!candidate ? (
                <div className="border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                  Primero obtené tu candidato para poder postular.
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}


