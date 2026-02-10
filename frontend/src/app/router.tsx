import { Suspense, lazy } from 'react'
import { Navigate, type RouteObject, useRoutes } from 'react-router-dom'
import { RequireAuth, RequireLinkedAccounts } from './guards.tsx'
import { PublicLayout } from '../layouts/PublicLayout'
import { AppLayout } from '../layouts/AppLayout'
import { useSession } from '../session/useSession'

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
      <div className="glass-surface mx-auto w-full max-w-3xl rounded-3xl p-6 sm:p-8">
        <p className="text-sm opacity-80">Loading…</p>
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

  const element = useRoutes(routes)
  return <Suspense fallback={<FullPageLoading />}>{element}</Suspense>
}

