type Props = {
  title: string
  description: string
}

export default function StepHeader({ title, description }: Props) {
  return (
    <div className="grid gap-2 text-center">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  )
}
