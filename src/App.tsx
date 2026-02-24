import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './App.css'
import ApplyInfo from './components/steps/ApplyInfo'
import CandidateLookup from './components/steps/CandidateLookup'
import JobsList from './components/steps/JobsList'
import RepoStep from './components/steps/RepoStep'
import ProgressBar from './components/ui/ProgressBar'
import StepNavigation from './components/ui/StepNavigation'
import SummaryPanel from './components/ui/SummaryPanel'
import type { Candidate, Job } from './types'

type Step = 1 | 2 | 3 | 4

const BASE_URL = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net'

async function readErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') || ''
  try {
    if (contentType.includes('application/json')) {
      const data = await response.json()
      if (typeof data === 'string') return data
      if (data?.message) return String(data.message)
      return JSON.stringify(data)
    }
    const text = await response.text()
    return text || response.statusText
  } catch {
    return response.statusText
  }
}

function App() {
  const [step, setStep] = useState<Step>(1)
  const [candidate, setCandidate] = useState<Candidate | null>(null)

  const [jobs, setJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState<string | null>(null)

  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [repoUrl, setRepoUrl] = useState('')

  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadJobs() {
      setJobsLoading(true)
      setJobsError(null)
      try {
        const response = await fetch(`${BASE_URL}/api/jobs/get-list`)
        if (!response.ok) {
          const message = await readErrorMessage(response)
          throw new Error(message)
        }
        const data = (await response.json()) as Job[]
        if (!cancelled) {
          setJobs(data)
        }
      } catch (error) {
        if (!cancelled) {
          setJobsError(error instanceof Error ? error.message : 'Error inesperado')
        }
      } finally {
        if (!cancelled) {
          setJobsLoading(false)
        }
      }
    }

    loadJobs()

    return () => {
      cancelled = true
    }
  }, [])

  function resetSubmitState() {
    setSubmitError(null)
    setSubmitSuccess(false)
  }

  function handleSelectJob(job: Job) {
    if (!candidate) return

    setSelectedJob(job)
    resetSubmitState()
    setStep(3)
  }

  function handleCandidate(next: Candidate | null) {
    setCandidate(next)
    setSelectedJob(null)
    setRepoUrl('')
    resetSubmitState()
  }

  function canContinue(currentStep: Step): boolean {
    if (currentStep === 1) return Boolean(candidate)
    if (currentStep === 2) return Boolean(selectedJob)
    if (currentStep === 3) return Boolean(repoUrl.trim())
    return Boolean(candidate && selectedJob && repoUrl.trim())
  }

  function goNext() {
    if (!canContinue(step) || step === 4) return
    setStep((prev) => (prev + 1) as Step)
  }

  function goPrevious() {
    if (step === 1) return
    setStep((prev) => (prev - 1) as Step)
  }

  async function handleFinalSubmit() {
    resetSubmitState()

    if (!candidate || !selectedJob || !repoUrl.trim()) {
      setSubmitError('Faltan datos para enviar la postulación.')
      return
    }

    setSubmitLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: candidate.uuid,
          jobId: selectedJob.id,
          candidateId: candidate.candidateId,
          repoUrl: repoUrl.trim(),
        }),
      })

      if (!response.ok) {
        const message = await readErrorMessage(response)
        throw new Error(message)
      }

      setSubmitSuccess(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setSubmitLoading(false)
    }
  }

  const showSummary = step === 2 || step === 3

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-6 py-12">
        <header className="grid gap-3 text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">Portal de postulación</h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600">
            Completá el formulario por pasos para enviar tu postulación.
          </p>
        </header>

        <section className="grid w-full gap-6 border border-slate-200 bg-white p-6">
          <ProgressBar step={step} totalSteps={4} />

          {showSummary ? (
            <SummaryPanel candidate={candidate} selectedJob={selectedJob} repoUrl={repoUrl} />
          ) : null}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <CandidateLookup
                  baseUrl={BASE_URL}
                  candidate={candidate}
                  onCandidate={handleCandidate}
                  onError={() => {}}
                />
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <JobsList
                  jobs={jobs}
                  jobsLoading={jobsLoading}
                  jobsError={jobsError}
                  candidate={candidate ? { uuid: candidate.uuid, candidateId: candidate.candidateId } : null}
                  selectedJobId={selectedJob?.id ?? null}
                  onSelect={handleSelectJob}
                />
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <RepoStep repoUrl={repoUrl} onRepoChange={setRepoUrl} />
              </motion.div>
            ) : null}

            {step === 4 ? (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <ApplyInfo candidate={candidate} selectedJob={selectedJob} repoUrl={repoUrl} />
              </motion.div>
            ) : null}
          </AnimatePresence>

          {submitError ? (
            <div className="border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          {submitSuccess ? (
            <div className="border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Postulación enviada correctamente.
            </div>
          ) : null}

          <StepNavigation
            step={step}
            totalSteps={4}
            submitLoading={submitLoading}
            canContinue={canContinue(step)}
            onPrevious={goPrevious}
            onNext={goNext}
            onSubmit={handleFinalSubmit}
          />
        </section>
      </div>
    </div>
  )
}

export default App
