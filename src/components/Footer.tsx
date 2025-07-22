import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin, Plane } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-client'
import { headers } from 'next/headers'

async function getFooterSettings() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .eq('setting_group', 'footer')
  
  const settings: Record<string, string> = {}
  data?.forEach((item: { setting_key: string, setting_value: string | null }) => {
    settings[item.setting_key] = item.setting_value || ''
  })
  
  return settings
}

const Footer = async () => {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || ''
  
  // 관리자 페이지에서는 푸터를 표시하지 않음
  if (pathname.startsWith('/admin')) {
    return null
  }
  
  // 설정 정보 가져오기
  const footerSettings = await getFooterSettings()
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <Plane className="w-6 h-6" />
              TripStore
            </Link>
            <p className="text-gray-400 mb-4">
              전 세계 어디든, 당신의 꿈을 현실로 만들어드립니다. 
              맞춤형 여행 패키지와 전문 가이드 서비스를 제공합니다.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-500 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Travel Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">여행 카테고리</h4>
            <ul className="space-y-2">
              <li><Link href="/overseas" className="text-gray-400 hover:text-blue-400 transition-colors">해외여행</Link></li>
              <li><Link href="/domestic" className="text-gray-400 hover:text-blue-400 transition-colors">국내여행</Link></li>
              <li><Link href="/hotel" className="text-gray-400 hover:text-blue-400 transition-colors">호텔</Link></li>
              <li><Link href="/luxury" className="text-gray-400 hover:text-blue-400 transition-colors">럭셔리</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">연락처</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 text-blue-400" />
                <div>
                  <p className="font-medium">{footerSettings.footer_email || 'info@tripstore.co.kr'}</p>
                  <p className="text-sm text-gray-400">24시간 이메일 상담</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-blue-400" />
                <div>
                  <p className="font-medium">{footerSettings.footer_address || '서울특별시 강남구 테헤란로 123길 45'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">문의하기</h4>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-white">1:1 채팅 상담</p>
                <div className="mt-2 bg-white p-3 rounded-lg w-32 h-32 flex items-center justify-center">
                  {footerSettings.footer_kakao_qr ? (
                    <img 
                      src={footerSettings.footer_kakao_qr} 
                      alt="카카오톡 QR 코드" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">(카카오톡 QR코드 위치)</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-sm text-gray-400">
            <p className="mb-1">
              <span className="mr-4">사업자등록번호: {footerSettings.footer_business_number || '123-45-67890'}</span>
              <span className="mr-4">대표: {footerSettings.footer_ceo || '홍길동'}</span>
              <span>통신판매업신고: {footerSettings.footer_mail_order_business || '2024-서울강남-1234'}</span>
            </p>
            <p>
              <span className="mr-4">{footerSettings.footer_company_name || '트립스토어 주식회사'}</span>
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {footerSettings.footer_copyright || '© 2025 트립스토어 All Rights Reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
