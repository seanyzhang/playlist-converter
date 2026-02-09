import { Link } from 'react-router-dom'
import { GlassButton } from '../components/GlassButton.tsx'
import { GlassCard } from '../components/GlassCard.tsx'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <GlassCard>
          <h1 className="text-2xl font-semibold tracking-tight text-(--pc-text)">Page not found</h1>
          <p className="mt-2 text-sm opacity-80">That route doesn’t exist.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/app">
              <GlassButton type="button">Go to app</GlassButton>
            </Link>
            <Link className="text-sm underline opacity-80 hover:opacity-100" to="/welcome">
              Back to welcome
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

