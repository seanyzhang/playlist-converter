import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthClient } from './authClient.ts'
import { SessionContext, type SessionContextValue } from './context.ts'
import { createMockAuthClient } from './mockAuthClient.ts'
import type { AuthIdentities, AuthProvider, AuthStatus, LinkedAccountProvider, LinkedAccounts, SessionSnapshot, User } from './types.ts'
import { isFullyLinked } from './types.ts'

const EMPTY_LINKED: LinkedAccounts = { spotify: false, netease: false }
const EMPTY_IDENTITIES: AuthIdentities = { google: false, apple: false, phone: false }

function snapshotToState(snapshot: SessionSnapshot | null): {
  user: User | null
  linkedAccounts: LinkedAccounts
  identities: AuthIdentities
} {
  if (!snapshot) return { user: null, linkedAccounts: EMPTY_LINKED, identities: EMPTY_IDENTITIES }
  return {
    user: snapshot.user,
    linkedAccounts: snapshot.linkedAccounts,
    identities: snapshot.identities ?? EMPTY_IDENTITIES,
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const client = useMemo<AuthClient>(() => createMockAuthClient(), [])

  const [status, setStatus] = useState<AuthStatus>('loading')
  const [{ user, linkedAccounts, identities }, setSession] = useState(() => snapshotToState(null))
  const [isBusy, setIsBusy] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsBusy(true)
    setLastError(null)
    try {
      const snapshot = await client.getSession()
      setSession(snapshotToState(snapshot))
      setStatus(snapshot ? 'signed_in' : 'signed_out')
    } catch (err) {
      setLastError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('signed_out')
      setSession(snapshotToState(null))
    } finally {
      setIsBusy(false)
    }
  }, [client])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const signInWithProvider = useCallback(
    async (provider: AuthProvider) => {
      setIsBusy(true)
      setLastError(null)
      try {
        const snapshot = await client.signInWithProvider(provider)
        setSession(snapshotToState(snapshot))
        setStatus('signed_in')
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Unknown error')
        setStatus('signed_out')
        setSession(snapshotToState(null))
      } finally {
        setIsBusy(false)
      }
    },
    [client],
  )

  const startPhoneSignIn = useCallback(
    async (phoneNumber: string) => {
      setIsBusy(true)
      setLastError(null)
      try {
        return await client.startPhoneSignIn(phoneNumber)
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Unknown error')
        throw err
      } finally {
        setIsBusy(false)
      }
    },
    [client],
  )

  const verifyPhoneOtp = useCallback(
    async (verificationId: string, code: string) => {
      setIsBusy(true)
      setLastError(null)
      try {
        const snapshot = await client.verifyPhoneOtp(verificationId, code)
        setSession(snapshotToState(snapshot))
        setStatus('signed_in')
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Unknown error')
        throw err
      } finally {
        setIsBusy(false)
      }
    },
    [client],
  )

  const signOut = useCallback(async () => {
    setIsBusy(true)
    setLastError(null)
    try {
      await client.signOut()
      setStatus('signed_out')
      setSession(snapshotToState(null))
    } catch (err) {
      setLastError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsBusy(false)
    }
  }, [client])

  const linkOAuthProvider = useCallback(
    async (provider: AuthProvider) => {
      setIsBusy(true)
      setLastError(null)
      try {
        const next = await client.linkOAuthProvider(provider)
        setSession((prev) => ({ ...prev, user: next.user, identities: next.identities }))
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Unknown error')
        throw err
      } finally {
        setIsBusy(false)
      }
    },
    [client],
  )

  const startPhoneLink = useCallback(
    async (phoneNumber: string) => {
      setIsBusy(true)
      setLastError(null)
      try {
        return await client.startPhoneLink(phoneNumber)
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Unknown error')
        throw err
      } finally {
        setIsBusy(false)
      }
    },
    [client],
  )

  const verifyPhoneLink = useCallback(
    async (verificationId: string, code: string) => {
      setIsBusy(true)
      setLastError(null)
      try {
        const next = await client.verifyPhoneLink(verificationId, code)
        setSession((prev) => ({ ...prev, user: next.user, identities: next.identities }))
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Unknown error')
        throw err
      } finally {
        setIsBusy(false)
      }
    },
    [client],
  )

  const linkAccount = useCallback(
    async (provider: LinkedAccountProvider) => {
      setIsBusy(true)
      setLastError(null)
      try {
        const next = await client.linkAccount(provider)
        setSession((prev) => ({ ...prev, linkedAccounts: next }))
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Unknown error')
        throw err
      } finally {
        setIsBusy(false)
      }
    },
    [client],
  )

  const unlinkAccount = useCallback(
    async (provider: LinkedAccountProvider) => {
      setIsBusy(true)
      setLastError(null)
      try {
        const next = await client.unlinkAccount(provider)
        setSession((prev) => ({ ...prev, linkedAccounts: next }))
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Unknown error')
        throw err
      } finally {
        setIsBusy(false)
      }
    },
    [client],
  )

  const value = useMemo<SessionContextValue>(
    () => ({
      status,
      user,
      linkedAccounts,
      identities,
      isFullyLinked: isFullyLinked(linkedAccounts),
      isBusy,
      lastError,
      actions: {
        refresh,
        clearError: () => setLastError(null),
        signInWithProvider,
        startPhoneSignIn,
        verifyPhoneOtp,
        signOut,
        linkOAuthProvider,
        startPhoneLink,
        verifyPhoneLink,
        linkAccount,
        unlinkAccount,
      },
    }),
    [
      identities,
      isBusy,
      lastError,
      linkAccount,
      linkedAccounts,
      linkOAuthProvider,
      refresh,
      signInWithProvider,
      signOut,
      startPhoneLink,
      startPhoneSignIn,
      status,
      unlinkAccount,
      user,
      verifyPhoneLink,
      verifyPhoneOtp,
    ],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

