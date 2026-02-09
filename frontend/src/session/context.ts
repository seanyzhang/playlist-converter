import { createContext } from 'react'
import type { PhoneChallenge } from './authClient.ts'
import type { AuthProvider, AuthStatus, LinkedAccountProvider, LinkedAccounts, User } from './types.ts'

export type SessionContextValue = Readonly<{
  status: AuthStatus
  user: User | null
  linkedAccounts: LinkedAccounts
  isFullyLinked: boolean
  isBusy: boolean
  lastError: string | null
  actions: {
    refresh(): Promise<void>
    clearError(): void

    signInWithProvider(provider: AuthProvider): Promise<void>
    startPhoneSignIn(phoneNumber: string): Promise<PhoneChallenge>
    verifyPhoneOtp(verificationId: string, code: string): Promise<void>
    signOut(): Promise<void>

    linkAccount(provider: LinkedAccountProvider): Promise<void>
    unlinkAccount(provider: LinkedAccountProvider): Promise<void>
  }
}>

export const SessionContext = createContext<SessionContextValue | null>(null)

