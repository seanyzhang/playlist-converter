import type { AuthIdentities, AuthProvider, LinkedAccountProvider, LinkedAccounts, SessionSnapshot } from './types.ts'

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

  linkOAuthProvider(provider: AuthProvider): Promise<{ user: SessionSnapshot['user']; identities: AuthIdentities }>
  startPhoneLink(phoneNumber: string): Promise<PhoneChallenge>
  verifyPhoneLink(verificationId: string, code: string): Promise<{ user: SessionSnapshot['user']; identities: AuthIdentities }>

  linkAccount(provider: LinkedAccountProvider): Promise<LinkedAccounts>
  unlinkAccount(provider: LinkedAccountProvider): Promise<LinkedAccounts>
}

