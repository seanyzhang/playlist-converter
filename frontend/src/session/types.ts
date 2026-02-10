export type AuthProvider = 'google' | 'apple'

export type LinkedAccountProvider = 'spotify' | 'netease'

export type AuthStatus = 'loading' | 'signed_out' | 'signed_in'

export type AuthIdentities = Readonly<{
  google: boolean
  apple: boolean
  phone: boolean
}>

export type LinkedAccounts = Readonly<{
  spotify: boolean
  netease: boolean
}>

export type User = Readonly<{
  id: string
  displayName: string
  email?: string
  phoneNumber?: string
}>

export type SessionSnapshot = Readonly<{
  user: User
  linkedAccounts: LinkedAccounts
  identities: AuthIdentities
}>

export function isFullyLinked(linked: LinkedAccounts): boolean {
  return linked.spotify && linked.netease
}

