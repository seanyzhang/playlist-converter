import type { ReactNode } from 'react'

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className={['glass-surface rounded-3xl p-6 sm:p-8', className].filter(Boolean).join(' ')}>
      {children}
    </section>
  )
}

