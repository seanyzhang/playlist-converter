import { useContext } from 'react'
import { SessionContext, type SessionContextValue } from './context.ts'

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext)
  if (!value) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return value
}

