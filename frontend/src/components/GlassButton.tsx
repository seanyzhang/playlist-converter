import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function GlassButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...props}
      className={['glass-button inline-flex items-center justify-center gap-2 text-sm font-medium', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}

