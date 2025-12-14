import type { AppProps } from 'next/app'
import Link from 'next/link'
import { useRouter } from 'next/router'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isAuthPage = router.pathname.startsWith('/auth')

  return (
    <>
      {!isAuthPage && (
        <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-2xl">
          <div className="container mx-auto px-4 py-5 flex justify-between items-center">
            <Link href="/" className="text-3xl font-black tracking-tight">
              ✨ VCI
            </Link>
            <div className="flex gap-8">
              <Link href="/events" className="hover:text-indigo-200 transition">
                Events
              </Link>
              <Link href="/dashboard" className="hover:text-indigo-200 transition">
                Dashboard
              </Link>
              <Link href="/auth/login" className="bg-pink-500 px-6 py-2 rounded-lg hover:bg-pink-600 transition font-semibold">
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
