import { Link } from 'react-router-dom'
import { GlassButton } from '../components/GlassButton.tsx'
import { GlassCard } from '../components/GlassCard.tsx'
import { StepIndicator } from '../components/StepIndicator.tsx'
import { useSession } from '../session/useSession.ts'

export default function OnboardingLinkPage() {
  const { linkedAccounts, isBusy, isFullyLinked, actions, user, lastError } = useSession()

  const steps = ['Link Spotify', 'Link NetEase'] as const
  const currentStep = linkedAccounts.spotify ? 1 : 0

  return (
    <GlassCard>
      <h1 className="text-2xl font-semibold tracking-tight text-(--pc-text)">Link your music accounts</h1>
      <p className="mt-2 max-w-2xl text-sm opacity-80">
        Welcome {user?.displayName ?? ''}. Linking now is recommended, but you can also do it later.
      </p>

      {lastError ? (
        <div className="mt-5 rounded-2xl border border-black/10 bg-white/40 p-4">
          <p className="text-sm font-medium">Couldn’t update linking</p>
          <p className="mt-1 text-sm opacity-80">{lastError}</p>
        </div>
      ) : null}

      <div className="mt-6">
        <StepIndicator currentStep={currentStep} steps={steps} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white/30 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Spotify</div>
              <p className="mt-1 text-xs opacity-75">
                In production this will use Authorization Code + PKCE (frontend initiated, tokens stored server-side).
              </p>
            </div>
            <span className="text-xs font-semibold">{linkedAccounts.spotify ? 'Linked' : 'Not linked'}</span>
          </div>
          <div className="mt-4">
            {linkedAccounts.spotify ? (
              <GlassButton disabled={isBusy} onClick={() => actions.unlinkAccount('spotify')} type="button">
                Unlink Spotify
              </GlassButton>
            ) : (
              <GlassButton disabled={isBusy} onClick={() => actions.linkAccount('spotify')} type="button">
                Link Spotify
              </GlassButton>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white/30 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">NetEase Music</div>
              <p className="mt-1 text-xs opacity-75">
                NetEase integration may require an explicit decision if it depends on unofficial APIs.
              </p>
            </div>
            <span className="text-xs font-semibold">{linkedAccounts.netease ? 'Linked' : 'Not linked'}</span>
          </div>
          <div className="mt-4">
            {linkedAccounts.netease ? (
              <GlassButton disabled={isBusy} onClick={() => actions.unlinkAccount('netease')} type="button">
                Unlink NetEase
              </GlassButton>
            ) : (
              <GlassButton disabled={isBusy} onClick={() => actions.linkAccount('netease')} type="button">
                Link NetEase
              </GlassButton>
            )}
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link to="/app">
          <GlassButton type="button">
            {isFullyLinked ? 'Continue to app' : 'Skip for now'}
          </GlassButton>
        </Link>
        {!isFullyLinked ? (
          <p className="text-xs opacity-70">You can link later from Account (or when you open Convert).</p>
        ) : null}
      </div>
    </GlassCard>
  )
}

