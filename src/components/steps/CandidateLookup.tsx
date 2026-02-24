import { useMemo, useState } from 'react'
import type { Candidate, CandidateLookupProps } from '../../types'
import StepHeader from '../ui/StepHeader'

async function readErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') || ''
  try {
    if (contentType.includes('application/json')) {
      const data = await response.json()
      if (typeof data === 'string') return data
      if (data?.message) return String(data.message)
      if (data?.error) return String(data.error)
      return JSON.stringify(data)
    }
    const text = await response.text()
    return text || response.statusText
  } catch {
    return response.statusText
  }
}

export default function CandidateLookup({ baseUrl, candidate, onCandidate, onError }: CandidateLookupProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const candidateLabel = useMemo(() => {
    if (!candidate) return null
    return `${candidate.firstName} ${candidate.lastName}`.trim()
  }, [candidate])

  async function handleFetchCandidate() {
    if (!email.trim()) {
      setLocalError('Ingresá un email válido.')
      return
    }

    setLoading(true)
    setLocalError(null)
    onError(null)
    onCandidate(null)

    try {
      const url = `${baseUrl}/api/candidate/get-by-email?email=${encodeURIComponent(email.trim())}`
      const response = await fetch(url)
      if (!response.ok) {
        const message = await readErrorMessage(response)
        throw new Error(message)
      }
      const data = (await response.json()) as Candidate
      onCandidate(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado'
      setLocalError(message)
      onError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <StepHeader
        title="Paso 1 · Obtener tus datos"
        description="Ingresá tu email para traer tus datos y continuar."
      />

      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 sm:flex-row sm:items-center">
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleFetchCandidate}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Buscando...' : 'Buscar candidato'}
        </button>
      </div>

      {localError ? (
        <div className="border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">{localError}</div>
      ) : null}

      {candidate ? (
        <div className="grid gap-2 border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <div>
            <span className="font-semibold text-slate-900">Candidato:</span> {candidateLabel}
          </div>
          <div>
            <span className="font-semibold text-slate-900">Email:</span> {candidate.email}
          </div>
          <div>
            <span className="font-semibold text-slate-900">UUID:</span> {candidate.uuid}
          </div>
          <div>
            <span className="font-semibold text-slate-900">Candidate ID:</span> {candidate.candidateId}
          </div>
        </div>
      ) : null}
    </div>
  )
}


