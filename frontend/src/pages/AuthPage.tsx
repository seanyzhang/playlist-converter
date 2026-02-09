import { useMemo, useState } from 'react'
import { GlassButton } from '../components/GlassButton.tsx'
import { GlassCard } from '../components/GlassCard.tsx'
import { TextField } from '../components/TextField.tsx'
import { useSession } from '../session/useSession.ts'
import type { PhoneChallenge } from '../session/authClient.ts'

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, '')
}

export default function AuthPage() {
  const { actions, isBusy, lastError } = useSession()
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
      <h1 className="text-2xl font-semibold tracking-tight text-(--pc-text)">Sign in</h1>
      <p className="mt-2 max-w-2xl text-sm opacity-80">
        Auth is mocked in this repo for now. In production, Google/Apple OAuth and phone OTP require a backend (PKCE,
        signed client secrets, and an SMS provider).
      </p>

      {lastError ? (
        <div className="mt-5 rounded-2xl border border-black/10 bg-white/40 p-4">
          <p className="text-sm font-medium">Couldn’t sign in</p>
          <p className="mt-1 text-sm opacity-80">{lastError}</p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <GlassButton disabled={isBusy} onClick={() => actions.signInWithProvider('google')} type="button">
          Continue with Google
        </GlassButton>
        <GlassButton disabled={isBusy} onClick={() => actions.signInWithProvider('apple')} type="button">
          Continue with Apple
        </GlassButton>
      </div>

      <div className="mt-8 rounded-3xl border border-black/10 bg-white/30 p-5">
        <h2 className="text-sm font-semibold tracking-tight">Phone number</h2>
        <p className="mt-1 text-xs opacity-75">
          Mock OTP flow. After requesting a code, enter <span className="font-semibold">123456</span> to continue.
        </p>

        {!challenge ? (
          <form
            className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end"
            onSubmit={async (e) => {
              e.preventDefault()
              actions.clearError()
              const normalized = normalizePhone(phoneNumber)
              if (!normalized || phoneError) return
              const ch = await actions.startPhoneSignIn(normalized)
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
              await actions.verifyPhoneOtp(challenge.verificationId, code)
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
                Verify
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
        )}
      </div>
    </GlassCard>
  )
}

