import type { InputHTMLAttributes } from 'react'

export function TextField({
  label,
  hint,
  error,
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
}) {
  const inputId = id ?? `tf_${label.replace(/\s+/g, '_').toLowerCase()}`
  const describedBy = [hint ? `${inputId}_hint` : null, error ? `${inputId}_err` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      <label className="block text-sm font-medium" htmlFor={inputId}>
        {label}
      </label>
      {hint ? (
        <p className="mt-1 text-xs opacity-70" id={`${inputId}_hint`}>
          {hint}
        </p>
      ) : null}
      <input
        {...props}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className={[
          'mt-2 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm shadow-sm outline-none',
          'focus-visible:ring-2 focus-visible:ring-black/10',
        ].join(' ')}
        id={inputId}
      />
      {error ? (
        <p className="mt-2 text-xs font-medium text-(--pc-orange)" id={`${inputId}_err`}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

