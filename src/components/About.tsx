'use client'

import { Shield, Globe, Users, Award, Phone, Mail, MapPin } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Shield,
      title: '안전한 여행',
      description: '24시간 응급상황 지원과 여행자 보험으로 안전한 여행을 보장합니다.'
    },
    {
      icon: Globe,
      title: '전 세계 네트워크',
      description: '50개국 이상의 현지 파트너와 함께 최고의 서비스를 제공합니다.'
    },
    {
      icon: Users,
      title: '전문 가이드',
      description: '현지 문화에 정통한 전문 가이드가 특별한 경험을 선사합니다.'
    },
    {
      icon: Award,
      title: '15년 신뢰',
      description: '15년간 축적된 노하우와 10,000명 이상의 고객 만족을 자랑합니다.'
    }
  ]

  const stats = [
    { number: '50+', label: '여행 국가' },
    { number: '1,000+', label: '여행 패키지' },
    { number: '10,000+', label: '만족한 고객' },
    { number: '15년', label: '신뢰의 경험' }
  ]

  return (
    <>
      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                왜 TripStore를 선택해야 할까요?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                TripStore는 15년간 여행업계에서 쌓아온 전문성과 신뢰를 바탕으로 
                고객 맞춤형 여행 서비스를 제공합니다. 전 세계 어디든 안전하고 
                특별한 여행 경험을 선사해드리겠습니다.
              </p>

              {/* Features */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
