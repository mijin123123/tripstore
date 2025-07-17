import './globals.css'

export const metadata = {
  title: 'TripStore',
  description: '여행 패키지 예약 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  )
}
