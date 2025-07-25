import '../styles/globals.css'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { headers } from 'next/headers'
import dynamic from 'next/dynamic'

// 인증 제공자 컴포넌트를 동적으로 로드 (클라이언트 측에서만 실행)
const AuthProviderWrapper = dynamic(
  () => import('@/components/AuthProvider').then((mod) => mod.AuthProvider),
  { ssr: false }
)

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

const notoSansKR = Noto_Sans_KR({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

export const metadata = {
  title: 'TripStore - 해외여행 전문 여행사',
  description: '전 세계 어디든, 당신의 꿈을 현실로 만들어드립니다. 맞춤형 여행 패키지와 전문 가이드 서비스를 제공합니다.',
  keywords: '해외여행, 여행패키지, 맞춤여행, 해외투어, 여행사',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={notoSansKR.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 antialiased`}>
        <AuthProviderWrapper>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProviderWrapper>
      </body>
    </html>
  )
}
