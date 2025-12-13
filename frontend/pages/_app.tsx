import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isAuthPage = router.pathname.startsWith('/auth')

  return (
    <>
      {!isAuthPage && (
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              VCI
            </Link>
            <div className="flex gap-6">
              <Link href="/events" className="hover:text-blue-200">
                Events
              </Link>
              <Link href="/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
              <Link href="/auth/login" className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800">
                Login
              </Link>
            </div>
          </div>
        </nav>
      )}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
