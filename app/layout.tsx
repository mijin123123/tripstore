import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TripStore - 해외여행 전문 여행사',
  description: '최고의 해외여행 패키지를 만나보세요. 전 세계 여행지의 특별한 경험을 TripStore에서 예약하세요.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
