import { motion } from 'framer-motion'

type Props = {
  step: number
  totalSteps: number
}

export default function ProgressBar({ step, totalSteps }: Props) {
  const progress = (step / totalSteps) * 100

  return (
    <div className="grid gap-3">
      <div className="text-center text-xs uppercase tracking-[0.2em] text-slate-500">
        Progreso paso {step} de {totalSteps}
      </div>
      <div className="h-2 w-full border border-slate-200 bg-slate-100">
        <motion.div
          className="h-full bg-sky-500"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
