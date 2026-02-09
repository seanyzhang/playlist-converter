import { Link } from 'react-router-dom'
import { GlassButton } from '../components/GlassButton.tsx'
import { GlassCard } from '../components/GlassCard.tsx'
import { useSession } from '../session/useSession.ts'

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
        ok ? 'border-black/10 bg-white/55' : 'border-black/10 bg-white/25 opacity-80',
      ].join(' ')}
    >
      {label}: {ok ? 'linked' : 'not linked'}
    </span>
  )
}

export default function AccountPage() {
  const { user, linkedAccounts, isBusy, isFullyLinked, actions, lastError } = useSession()

  return (
    <GlassCard>
      <h1 className="text-2xl font-semibold tracking-tight text-(--pc-text)">Account</h1>
      <p className="mt-2 text-sm opacity-80">Session and linked-accounts state is mocked for now.</p>

      {lastError ? (
        <div className="mt-5 rounded-2xl border border-black/10 bg-white/40 p-4">
          <p className="text-sm font-medium">Something went wrong</p>
          <p className="mt-1 text-sm opacity-80">{lastError}</p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white/30 p-5">
          <div className="text-sm font-semibold">Profile</div>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="opacity-70">Name</dt>
              <dd className="font-medium">{user?.displayName ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="opacity-70">Email</dt>
              <dd className="font-medium">{user?.email ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="opacity-70">Phone</dt>
              <dd className="font-medium">{user?.phoneNumber ?? '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white/30 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold">Linked accounts</div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill label="Spotify" ok={linkedAccounts.spotify} />
              <StatusPill label="NetEase" ok={linkedAccounts.netease} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <GlassButton
              disabled={isBusy}
              onClick={() => (linkedAccounts.spotify ? actions.unlinkAccount('spotify') : actions.linkAccount('spotify'))}
              type="button"
            >
              {linkedAccounts.spotify ? 'Unlink Spotify' : 'Link Spotify'}
            </GlassButton>
            <GlassButton
              disabled={isBusy}
              onClick={() => (linkedAccounts.netease ? actions.unlinkAccount('netease') : actions.linkAccount('netease'))}
              type="button"
            >
              {linkedAccounts.netease ? 'Unlink NetEase' : 'Link NetEase'}
            </GlassButton>
          </div>

          {!isFullyLinked ? (
            <div className="mt-4">
              <Link className="text-sm underline opacity-80 hover:opacity-100" to="/onboarding/link">
                Go to linking wizard
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <GlassButton disabled={isBusy} onClick={() => actions.signOut()} type="button">
          Sign out
        </GlassButton>
        <Link className="text-sm underline opacity-80 hover:opacity-100" to="/welcome">
          Back to welcome
        </Link>
      </div>
    </GlassCard>
  )
}

