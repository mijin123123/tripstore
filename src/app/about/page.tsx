import { Users, Globe, Award, Heart, MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: Users, label: '누적 고객', value: '50,000+', desc: '명' },
    { icon: Globe, label: '여행 국가', value: '120+', desc: '개국' },
    { icon: Award, label: '수상 경력', value: '15+', desc: '회' },
    { icon: Heart, label: '고객 만족도', value: '98%', desc: '' }
  ]

  const team = [
    {
      name: '김여행',
      position: '대표이사',
      experience: '15년',
      specialty: '유럽 여행 전문',
      image: '/images/team-ceo.jpg'
    },
    {
      name: '이가이드',
      position: '여행기획팀장',
      experience: '12년',
      specialty: '동남아/일본 전문',
      image: '/images/team-guide.jpg'
    },
    {
      name: '박서비스',
      position: '고객서비스팀장',
      experience: '8년',
      specialty: '럭셔리 여행 전문',
      image: '/images/team-service.jpg'
    }
  ]

  const values = [
    {
      icon: Heart,
      title: '고객 중심',
      description: '고객의 꿈과 희망을 현실로 만들어드리는 것이 저희의 사명입니다.'
    },
    {
      icon: Award,
      title: '전문성',
      description: '풍부한 경험과 전문 지식으로 완벽한 여행을 기획합니다.'
    },
    {
      icon: Globe,
      title: '글로벌 네트워크',
      description: '전 세계 파트너와의 협력으로 최고의 서비스를 제공합니다.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-6">TripStore</h1>
            <p className="text-xl mb-8 leading-relaxed">
              전 세계 어디든, 당신의 꿈을 현실로 만들어드립니다<br />
              2010년부터 지금까지, 고객과 함께 성장해온 여행 전문가입니다
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* 회사 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label} {stat.desc}
                </div>
              </div>
            )
          })}
        </div>

        {/* 회사 소개 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">우리의 이야기</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                TripStore는 2010년 작은 여행사로 시작하여, 지금은 국내 최고의 
                온라인 여행 플랫폼으로 성장했습니다. 우리는 단순히 여행 상품을 
                판매하는 것이 아니라, 고객의 소중한 추억을 만들어드리는 것을 
                목표로 합니다.
              </p>
              <p>
                전문적인 여행 상담부터 현지에서의 24시간 지원까지, 고객의 여행 
                전 과정을 책임집니다. 우리와 함께라면 어디든 안전하고 즐거운 
                여행이 가능합니다.
              </p>
              <p>
                앞으로도 더 많은 고객들이 세상의 아름다움을 경험할 수 있도록 
                끊임없이 노력하겠습니다.
              </p>
            </div>
          </div>
          <div className="relative h-64 lg:h-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl">
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <Globe className="w-24 h-24 opacity-80" />
            </div>
          </div>
        </div>

        {/* 핵심 가치 */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">우리의 핵심 가치</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 팀 소개 */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">우리 팀</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.position}</p>
                  <p className="text-gray-600 text-sm mb-1">경력: {member.experience}</p>
                  <p className="text-gray-600 text-sm">{member.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">연락처</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">주소</h3>
              <p className="text-gray-600 text-sm">
                서울특별시 강남구<br />
                테헤란로 123<br />
                트립빌딩 10층
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">전화번호</h3>
              <p className="text-gray-600 text-sm">
                고객센터: 1588-1234<br />
                비즈니스: 02-1234-5678<br />
                팩스: 02-1234-5679
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">이메일</h3>
              <p className="text-gray-600 text-sm">
                고객문의: info@tripstore.co.kr<br />
                제휴문의: business@tripstore.co.kr<br />
                채용문의: hr@tripstore.co.kr
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">운영시간</h3>
              <p className="text-gray-600 text-sm">
                평일: 09:00 - 18:00<br />
                토요일: 09:00 - 17:00<br />
                일요일 및 공휴일 휴무
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
