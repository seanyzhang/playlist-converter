import type { AuthClient, PhoneChallenge } from './authClient.ts'
import type { AuthProvider, LinkedAccountProvider, LinkedAccounts, SessionSnapshot, User } from './types.ts'

type StoredSession = {
  user: User
  linkedAccounts: LinkedAccounts
}

type StoredPhoneChallenge = {
  verificationId: string
  phoneNumber: string
  expectedCode: string
}

const STORAGE_KEY_SESSION = 'pc_mock_session_v1'
const STORAGE_KEY_PHONE = 'pc_mock_phone_v1'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomId(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`
}

function readJson<T>(key: string): T | null {
  const raw = sessionStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson<T>(key: string, value: T): void {
  sessionStorage.setItem(key, JSON.stringify(value))
}

function clearKey(key: string): void {
  sessionStorage.removeItem(key)
}

function defaultLinkedAccounts(): LinkedAccounts {
  return { spotify: false, netease: false }
}

function ensureSessionOrThrow(): StoredSession {
  const stored = readJson<StoredSession>(STORAGE_KEY_SESSION)
  if (!stored) {
    throw new Error('Not signed in.')
  }
  return stored
}

export function createMockAuthClient(): AuthClient {
  return {
    async getSession() {
      await sleep(150)
      const stored = readJson<StoredSession>(STORAGE_KEY_SESSION)
      return stored ? ({ user: stored.user, linkedAccounts: stored.linkedAccounts } satisfies SessionSnapshot) : null
    },

    async signInWithProvider(provider: AuthProvider) {
      await sleep(350)
      const displayName =
        provider === 'google' ? 'Mock Google User' : provider === 'apple' ? 'Mock Apple User' : 'Mock User'

      const user: User = {
        id: randomId('user'),
        displayName,
        email: provider === 'google' ? 'mock.user@example.com' : undefined,
      }

      const session: StoredSession = { user, linkedAccounts: defaultLinkedAccounts() }
      writeJson(STORAGE_KEY_SESSION, session)
      clearKey(STORAGE_KEY_PHONE)
      return { user: session.user, linkedAccounts: session.linkedAccounts } satisfies SessionSnapshot
    },

    async startPhoneSignIn(phoneNumber: string) {
      await sleep(250)
      const challenge: StoredPhoneChallenge = {
        verificationId: randomId('verify'),
        phoneNumber,
        expectedCode: '123456',
      }
      writeJson(STORAGE_KEY_PHONE, challenge)
      return {
        verificationId: challenge.verificationId,
        phoneNumber: challenge.phoneNumber,
      } satisfies PhoneChallenge
    },

    async verifyPhoneOtp(verificationId: string, code: string) {
      await sleep(350)
      const challenge = readJson<StoredPhoneChallenge>(STORAGE_KEY_PHONE)
      if (!challenge || challenge.verificationId !== verificationId) {
        throw new Error('That verification session expired. Please request a new code.')
      }
      if (code !== challenge.expectedCode) {
        throw new Error('Invalid code. (Try 123456 in the mock flow.)')
      }

      const user: User = {
        id: randomId('user'),
        displayName: 'Mock Phone User',
        phoneNumber: challenge.phoneNumber,
      }

      const session: StoredSession = { user, linkedAccounts: defaultLinkedAccounts() }
      writeJson(STORAGE_KEY_SESSION, session)
      clearKey(STORAGE_KEY_PHONE)
      return { user: session.user, linkedAccounts: session.linkedAccounts } satisfies SessionSnapshot
    },

    async signOut() {
      await sleep(150)
      clearKey(STORAGE_KEY_SESSION)
      clearKey(STORAGE_KEY_PHONE)
    },

    async linkAccount(provider: LinkedAccountProvider) {
      await sleep(250)
      const session = ensureSessionOrThrow()
      const next: StoredSession = {
        ...session,
        linkedAccounts: { ...session.linkedAccounts, [provider]: true },
      }
      writeJson(STORAGE_KEY_SESSION, next)
      return next.linkedAccounts
    },

    async unlinkAccount(provider: LinkedAccountProvider) {
      await sleep(250)
      const session = ensureSessionOrThrow()
      const next: StoredSession = {
        ...session,
        linkedAccounts: { ...session.linkedAccounts, [provider]: false },
      }
      writeJson(STORAGE_KEY_SESSION, next)
      return next.linkedAccounts
    },
  }
}

