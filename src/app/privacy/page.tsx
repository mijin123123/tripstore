'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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

        {/* 개인정보처리방침 내용 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
            <p className="text-gray-600">최종 업데이트: 2025년 7월 21일</p>
          </div>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 개인정보의 처리목적</h2>
              <p className="leading-relaxed mb-3">
                ㈜트립스토어(이하 '회사')는 다음의 목적을 위하여 개인정보를 처리합니다. 
                처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
                이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 
                필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                <li>여행상품 예약 및 결제, 여행서비스 제공</li>
                <li>고객센터 운영, 고객 상담 및 불만처리</li>
                <li>서비스 개선, 신규 서비스 개발을 위한 통계분석</li>
                <li>마케팅 및 광고에의 활용 (동의한 경우에 한함)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 개인정보의 처리 및 보유기간</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 
                  개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <p className="leading-relaxed">② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (단, 관계 법령에 의한 보존기간이 있는 경우 해당 기간까지)</li>
                    <li><strong>예약 및 결제 정보:</strong> 5년 (전자상거래법)</li>
                    <li><strong>고객 상담 기록:</strong> 3년</li>
                    <li><strong>접속 로그 기록:</strong> 3개월 (통신비밀보호법)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 처리하는 개인정보의 항목</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">가. 회원가입</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>필수항목: 이름, 이메일주소, 비밀번호, 휴대전화번호</li>
                    <li>선택항목: 생년월일, 성별</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">나. 여행상품 예약</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>필수항목: 예약자 정보(이름, 연락처), 여행자 정보(이름, 생년월일, 성별), 결제정보</li>
                    <li>해외여행 시: 여권번호, 여권만료일</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">다. 자동 수집 정보</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>IP주소, 쿠키, 접속 로그, 서비스 이용 기록</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 개인정보의 제3자 제공</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  ① 회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 
                  다만, 다음의 경우에는 예외로 합니다.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>정보주체가 사전에 동의한 경우</li>
                  <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                  <li>여행서비스 제공을 위해 필요한 경우 (항공사, 호텔, 현지 여행사 등)</li>
                </ul>
                <p className="leading-relaxed">
                  ② 여행서비스 제공을 위한 제3자 제공 시에는 최소한의 정보만 제공하며, 
                  제공받는 자에게 개인정보보호 의무를 부과합니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 개인정보처리의 위탁</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  ① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li><strong>결제처리:</strong> 결제대행업체 (신용카드, 계좌이체 등)</li>
                    <li><strong>이메일 발송:</strong> 이메일 발송 서비스 업체</li>
                    <li><strong>SMS 발송:</strong> SMS 발송 서비스 업체</li>
                    <li><strong>고객센터 운영:</strong> 고객센터 위탁 운영업체</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 정보주체의 권리·의무 및 행사방법</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  ① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>개인정보 처리현황 통지요구</li>
                  <li>개인정보 열람요구</li>
                  <li>개인정보 정정·삭제요구</li>
                  <li>개인정보 처리정지요구</li>
                </ul>
                <p className="leading-relaxed">
                  ② 제1항에 따른 권리 행사는 개인정보보호법 시행규칙 별지 제8호 서식에 따라 
                  작성하여 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 
                  회사는 이에 대해 지체없이 조치하겠습니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 개인정보의 안전성 확보조치</h2>
              <p className="leading-relaxed">
                회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
                <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
                <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. 개인정보보호책임자</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">개인정보보호책임자</p>
                <ul className="space-y-1 text-sm">
                  <li>성명: 홍길동</li>
                  <li>직책: 개인정보보호팀장</li>
                  <li>연락처: 02-1234-5678</li>
                  <li>이메일: privacy@tripstore.co.kr</li>
                </ul>
              </div>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. 개인정보처리방침의 변경</h2>
              <p className="leading-relaxed">
                이 개인정보처리방침은 2025년 7월 21일부터 적용됩니다. 
                개인정보처리방침이 변경되는 경우 변경사항을 웹사이트를 통해 공지하겠습니다.
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
