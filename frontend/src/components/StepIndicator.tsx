export function StepIndicator({
  steps,
  currentStep,
}: {
  steps: readonly string[]
  currentStep: number
}) {
  return (
    <ol className="flex flex-wrap items-center gap-3 text-sm">
      {steps.map((label, idx) => {
        const isActive = idx === currentStep
        const isDone = idx < currentStep
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={[
                'inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold',
                isDone ? 'border-black/10 bg-white/50' : isActive ? 'border-black/15 bg-white/65' : 'border-black/10 bg-white/25',
              ].join(' ')}
              aria-current={isActive ? 'step' : undefined}
            >
              {idx + 1}
            </span>
            <span className={isActive ? 'font-semibold' : 'opacity-75'}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

