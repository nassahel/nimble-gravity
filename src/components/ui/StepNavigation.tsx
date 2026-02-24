type Props = {
  step: number
  totalSteps: number
  submitLoading: boolean
  submitSuccess: boolean
  canContinue: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  onRestart: () => void
}

export default function StepNavigation({
  step,
  totalSteps,
  submitLoading,
  submitSuccess,
  canContinue,
  onPrevious,
  onNext,
  onSubmit,
  onRestart,
}: Props) {
  const showRestart = step === totalSteps && submitSuccess

  return (
    <div className="flex justify-center gap-3">
      {showRestart ? (
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center justify-center border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
        >
          Volver al inicio
        </button>
      ) : (
        <button
          type="button"
          onClick={onPrevious}
          disabled={step === 1 || submitLoading}
          className="inline-flex items-center justify-center border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Anterior
        </button>
      )}

      {step < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue || submitLoading}
          className="inline-flex items-center justify-center border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Siguiente
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canContinue || submitLoading || submitSuccess}
          className="inline-flex items-center justify-center border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLoading ? 'Enviando...' : submitSuccess ? 'Postulación enviada' : 'Enviar postulación'}
        </button>
      )}
    </div>
  )
}
