import '../styles/globals.css'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })
const notoSansKR = Noto_Sans_KR({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
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
  // URL 패턴을 서버 컴포넌트에서는 직접 확인할 수 없으므로
  // admin 경로에 대한 특별한 처리는 각 레이아웃에서 구현해야 함
  return (
    <html lang="ko" className={notoSansKR.className}>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
