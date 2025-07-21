'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>뒤로가기</span>
          </button>
        </div>

        {/* 이용약관 내용 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">이용약관</h1>
            <p className="text-gray-600">최종 업데이트: 2025년 7월 21일</p>
          </div>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
              <p className="leading-relaxed">
                이 약관은 ㈜트립스토어(이하 "회사")가 운영하는 TripStore 웹사이트에서 제공하는 
                인터넷 관련 서비스(이하 "서비스")를 이용함에 있어 회사와 이용자의 권리·의무 및 
                책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  ① "TripStore"란 회사가 여행상품 및 관련 서비스를 이용자에게 제공하기 위하여 
                  컴퓨터 등 정보통신설비를 이용하여 여행상품 등을 거래할 수 있도록 설정한 
                  가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.
                </p>
                <p className="leading-relaxed">
                  ② "이용자"란 "TripStore"에 접속하여 이 약관에 따라 "TripStore"가 제공하는 
                  서비스를 받는 회원 및 비회원을 말합니다.
                </p>
                <p className="leading-relaxed">
                  ③ '회원'이라 함은 "TripStore"에 회원등록을 한 자로서, 계속적으로 "TripStore"가 
                  제공하는 서비스를 이용할 수 있는 자를 말합니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (약관의 명시와 설명 및 개정)</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  ① "TripStore"는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소
                  (소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호·모사전송번호·전자우편주소, 
                  사업자등록번호, 통신판매업 신고번호, 개인정보관리책임자등을 이용자가 쉽게 알 수 있도록 
                  "TripStore"의 초기 서비스화면(전면)에 게시합니다.
                </p>
                <p className="leading-relaxed">
                  ② "TripStore"는 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 
                  청약철회·배송책임·환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 
                  별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (서비스의 제공 및 변경)</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  ① "TripStore"는 다음과 같은 업무를 수행합니다.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>여행상품에 대한 정보 제공 및 구매계약의 체결</li>
                  <li>구매계약이 체결된 여행상품의 서비스 제공</li>
                  <li>기타 "TripStore"가 정하는 업무</li>
                </ul>
                <p className="leading-relaxed">
                  ② "TripStore"는 여행상품이 품절되거나 기술적 사양의 변경 등의 경우에는 
                  장차 체결되는 계약에 의해 제공할 여행상품의 내용을 변경할 수 있습니다. 
                  이 경우에는 변경된 여행상품의 내용 및 제공일자를 명시하여 현재의 여행상품의 
                  내용을 게시한 곳에 즉시 공지합니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (서비스의 중단)</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  ① "TripStore"는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 
                  사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
                </p>
                <p className="leading-relaxed">
                  ② "TripStore"는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 
                  이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, "TripStore"가 고의 또는 
                  과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (회원가입)</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  ① 이용자는 "TripStore"가 정한 가입 양식에 따라 회원정보를 기입한 후 
                  이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
                </p>
                <p className="leading-relaxed">
                  ② "TripStore"는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 
                  다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                  <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                  <li>기타 회원으로 등록하는 것이 "TripStore"의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (개인정보보호)</h2>
              <p className="leading-relaxed">
                "TripStore"는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 
                최소한의 개인정보를 수집합니다. 수집하는 개인정보의 항목, 수집 및 이용목적, 
                보유 및 이용기간 등에 관한 사항은 개인정보처리방침에 따릅니다.
              </p>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">부칙</h2>
              <p className="leading-relaxed">
                이 약관은 2025년 7월 21일부터 적용됩니다.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              동의하고 회원가입 계속하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
