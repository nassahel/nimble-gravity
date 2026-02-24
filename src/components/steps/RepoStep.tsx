import StepHeader from '../ui/StepHeader'

type Props = {
  repoUrl: string
  onRepoChange: (value: string) => void
}

export default function RepoStep({ repoUrl, onRepoChange }: Props) {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <StepHeader
        title="Paso 3 · Agregar repositorio"
        description="Cargá la URL de tu repositorio de GitHub para continuar."
      />

      <label className="grid gap-2 text-sm text-slate-700">
        Repo URL
        <input
          required
          type="url"
          value={repoUrl}
          onChange={(event) => onRepoChange(event.target.value)}
          placeholder="https://github.com/tu-usuario/tu-repo"
          className="border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
        />
      </label>
    </div>
  )
}

