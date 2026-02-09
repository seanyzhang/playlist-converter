import type { AuthProvider, LinkedAccountProvider, LinkedAccounts, SessionSnapshot } from './types.ts'

export type PhoneChallenge = Readonly<{
  verificationId: string
  phoneNumber: string
}>

export interface AuthClient {
  getSession(): Promise<SessionSnapshot | null>

  signInWithProvider(provider: AuthProvider): Promise<SessionSnapshot>

  startPhoneSignIn(phoneNumber: string): Promise<PhoneChallenge>
  verifyPhoneOtp(verificationId: string, code: string): Promise<SessionSnapshot>

  signOut(): Promise<void>

  linkAccount(provider: LinkedAccountProvider): Promise<LinkedAccounts>
  unlinkAccount(provider: LinkedAccountProvider): Promise<LinkedAccounts>
}

