import { Suspense, lazy, useEffect, useState } from 'react'
import { Navigate, type RouteObject, useLocation, useRoutes } from 'react-router-dom'
import { RequireAuth, RequireLinkedAccounts } from './guards.tsx'
import { PublicLayout } from '../layouts/PublicLayout'
import { AppLayout } from '../layouts/AppLayout'
import { useSession } from '../session/useSession'

const PAGE_TRANSITION_MS = 350

const WelcomePage = lazy(() => import('../pages/WelcomePage'))
const AuthPage = lazy(() => import('../pages/AuthPage'))
const OnboardingLinkPage = lazy(() => import('../pages/OnboardingLinkPage'))

const HomePage = lazy(() => import('../pages/HomePage'))
const AccountPage = lazy(() => import('../pages/AccountPage'))
const PlaylistsPage = lazy(() => import('../pages/PlaylistsPage'))
const ConvertPage = lazy(() => import('../pages/ConvertPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function FullPageLoading() {
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center">
        <div className="pc-grid-loader" aria-label="Loading" role="status">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}

function RootRedirect() {
  const { status, user } = useSession()

  if (status === 'loading') return <FullPageLoading />
  if (!user) return <Navigate replace to="/welcome" />
  return <Navigate replace to="/app" />
}

function RedirectIfSignedIn({ children }: { children: React.ReactNode }) {
  const { status, user } = useSession()
  if (status === 'loading') return <FullPageLoading />
  if (user) return <Navigate replace to="/app" />
  return <>{children}</>
}

export function AppRoutes() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')

  const routes: RouteObject[] = [
    { path: '/', element: <RootRedirect /> },

    {
      element: <PublicLayout />,
      children: [
        { path: '/welcome', element: <RedirectIfSignedIn><WelcomePage /></RedirectIfSignedIn> },
        { path: '/auth', element: <RedirectIfSignedIn><AuthPage /></RedirectIfSignedIn> },
      ],
    },

    {
      path: '/onboarding',
      element: <RequireAuth />,
      children: [
        {
          element: <PublicLayout />,
          children: [{ path: 'link', element: <OnboardingLinkPage /> }],
        },
      ],
    },

    {
      path: '/app',
      element: <RequireAuth />,
      children: [
        {
          element: <AppLayout />,
          children: [
            { index: true, element: <HomePage /> },
            { path: 'account', element: <AccountPage /> },
            { path: 'playlists', element: <PlaylistsPage /> },
            { path: 'convert', element: <RequireLinkedAccounts><ConvertPage /></RequireLinkedAccounts> },
          ],
        },
      ],
    },

    { path: '*', element: <NotFoundPage /> },
  ]

  useEffect(() => {
    if (location.key === displayLocation.key) return

    setPhase('out')
    const t = window.setTimeout(() => {
      setDisplayLocation(location)
      setPhase('in')
    }, PAGE_TRANSITION_MS)

    return () => window.clearTimeout(t)
  }, [location, displayLocation.key])

  useEffect(() => {
    if (phase !== 'in') return
    const t = window.setTimeout(() => setPhase('idle'), PAGE_TRANSITION_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  const element = useRoutes(routes, displayLocation)

  return (
    <div
      className={[
        'pc-page-transition',
        phase === 'out' ? 'pc-page-transition--out' : '',
        phase === 'in' ? 'pc-page-transition--in' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Suspense fallback={<FullPageLoading />}>{element}</Suspense>
    </div>
  )
}

