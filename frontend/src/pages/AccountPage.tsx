import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassButton } from '../components/GlassButton.tsx'
import { GlassCard } from '../components/GlassCard.tsx'
import { TextField } from '../components/TextField.tsx'
import { useSession } from '../session/useSession.ts'
import type { PhoneChallenge } from '../session/authClient.ts'

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

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, '')
}

export default function AccountPage() {
  const { user, linkedAccounts, identities, isBusy, actions, lastError } = useSession()

  const hasOAuth = identities.google || identities.apple
  const linkedOAuthLabel = identities.google ? 'Google' : identities.apple ? 'Apple' : null

  const [linkPhoneOpen, setLinkPhoneOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [challenge, setChallenge] = useState<PhoneChallenge | null>(null)
  const [otp, setOtp] = useState('')

  const phoneError = useMemo(() => {
    const normalized = normalizePhone(phoneNumber)
    if (!normalized) return undefined
    if (normalized.length < 7) return 'Please enter a valid phone number.'
    return undefined
  }, [phoneNumber])

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

          {/* Sign-in method linking */}
          <div className="mt-5 border-t border-black/10 pt-4">
            <div className="text-sm font-semibold">Sign-in methods</div>
            <p className="mt-1 text-xs opacity-75">
              Optional account linking so you can recover access and use multiple sign-in methods.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className={['rounded-full border px-2.5 py-1 text-xs font-semibold', identities.phone ? 'border-black/10 bg-white/55' : 'border-black/10 bg-white/25 opacity-80'].join(' ')}>
                Phone: {identities.phone ? 'linked' : 'not linked'}
              </span>
              <span className={['rounded-full border px-2.5 py-1 text-xs font-semibold', identities.google ? 'border-black/10 bg-white/55' : 'border-black/10 bg-white/25 opacity-80'].join(' ')}>
                Google: {identities.google ? 'linked' : 'not linked'}
              </span>
              <span className={['rounded-full border px-2.5 py-1 text-xs font-semibold', identities.apple ? 'border-black/10 bg-white/55' : 'border-black/10 bg-white/25 opacity-80'].join(' ')}>
                Apple: {identities.apple ? 'linked' : 'not linked'}
              </span>
            </div>

            {/* If phone is present but email is missing, offer OAuth linking */}
            {user?.phoneNumber && !user.email ? (
              <div className="mt-4 rounded-2xl border border-black/10 bg-white/35 p-4">
                <p className="text-sm font-semibold">Add an OAuth account</p>
                <p className="mt-1 text-sm opacity-80">
                  You’re signed in with a phone number, but there’s no email on this account yet.
                </p>
                {hasOAuth && linkedOAuthLabel ? (
                  <p className="mt-2 text-xs opacity-70">
                    Only one OAuth provider can be linked. Currently linked: <span className="font-semibold">{linkedOAuthLabel}</span>.
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-3">
                  <GlassButton
                    disabled={isBusy || identities.google || identities.apple}
                    onClick={() => actions.linkOAuthProvider('google')}
                    type="button"
                  >
                    {identities.google ? 'Google linked' : 'Link Google'}
                  </GlassButton>
                  <GlassButton
                    disabled={isBusy || identities.apple || identities.google}
                    onClick={() => actions.linkOAuthProvider('apple')}
                    type="button"
                  >
                    {identities.apple ? 'Apple linked' : 'Link Apple'}
                  </GlassButton>
                </div>
              </div>
            ) : null}

            {/* If no phone number is present, offer opt-in phone linking */}
            {!user?.phoneNumber ? (
              <div className="mt-4 rounded-2xl border border-black/10 bg-white/35 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">Link a phone number</p>
                    <p className="mt-1 text-sm opacity-80">
                      Optional, but helpful for account recovery. Mock OTP uses <span className="font-semibold">123456</span>.
                    </p>
                  </div>
                  <button
                    className="text-sm underline opacity-80 hover:opacity-100"
                    onClick={() => {
                      actions.clearError()
                      setLinkPhoneOpen((v) => !v)
                      if (linkPhoneOpen) {
                        setChallenge(null)
                        setOtp('')
                      }
                    }}
                    type="button"
                  >
                    {linkPhoneOpen ? 'Hide' : 'Link phone'}
                  </button>
                </div>

                {linkPhoneOpen ? (
                  !challenge ? (
                    <form
                      className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end"
                      onSubmit={async (e) => {
                        e.preventDefault()
                        actions.clearError()
                        const normalized = normalizePhone(phoneNumber)
                        if (!normalized || phoneError) return
                        const ch = await actions.startPhoneLink(normalized)
                        setChallenge(ch)
                        setOtp('')
                      }}
                    >
                      <TextField
                        autoComplete="tel"
                        disabled={isBusy}
                        error={phoneError}
                        hint="Include country code if possible, e.g. +14155552671"
                        label="Phone number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 415 555 2671"
                        type="tel"
                        value={phoneNumber}
                      />
                      <div className="shrink-0">
                        <GlassButton disabled={isBusy || !!phoneError || !normalizePhone(phoneNumber)} type="submit">
                          Send code
                        </GlassButton>
                      </div>
                    </form>
                  ) : (
                    <form
                      className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end"
                      onSubmit={async (e) => {
                        e.preventDefault()
                        actions.clearError()
                        const code = otp.trim()
                        if (code.length < 4) return
                        await actions.verifyPhoneLink(challenge.verificationId, code)
                        setChallenge(null)
                        setOtp('')
                        setLinkPhoneOpen(false)
                      }}
                    >
                      <TextField
                        disabled={isBusy}
                        hint={`Code sent to ${challenge.phoneNumber}`}
                        label="One-time code"
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        inputMode="numeric"
                        value={otp}
                      />
                      <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <GlassButton disabled={isBusy || otp.trim().length < 4} type="submit">
                          Verify & link
                        </GlassButton>
                        <button
                          className="text-sm underline opacity-80 hover:opacity-100"
                          disabled={isBusy}
                          onClick={() => {
                            setChallenge(null)
                            setOtp('')
                          }}
                          type="button"
                        >
                          Use a different number
                        </button>
                      </div>
                    </form>
                  )
                ) : null}
              </div>
            ) : null}
          </div>
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

