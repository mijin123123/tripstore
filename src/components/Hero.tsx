'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Calendar, Users } from 'lucide-react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

const Hero = () => {
  const [destination, setDestination] = useState('')
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)

  useEffect(() => {
    async function fetchHeroImage() {
      const image = await getHeroImage('main')
      setHeroImage(image)
    }
    fetchHeroImage()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('검색:', destination)
  }

  // 기본값 설정
  const backgroundImage = heroImage?.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
  const title = heroImage?.title || '전 세계 어디든, 당신의 꿈을 현실로'
  const subtitle = heroImage?.subtitle || '맞춤형 여행 패키지와 전문 가이드 서비스로 특별한 추억을 만들어보세요'

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`
        }}
      />
      
      {/* Gradient Overlay - 더 투명하게 조정 */}
      <div 
        className="absolute inset-0"
        style={{
          background: gradientOverlay.replace(/0\.\d+/g, (match) => {
            const opacity = parseFloat(match);
            return (opacity * 0.6).toFixed(1); // 투명도를 60%로 감소
          })
        }}
      />
      
      {/* Content */}
      <div className="relative text-center text-white max-w-4xl px-4 z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up drop-shadow-lg">
          {title.includes('당신의 꿈') ? (
            <>
              전 세계 어디든, <span className="text-amber-400">당신의 꿈</span>을 현실로
            </>
          ) : (
            title
          )}
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-95 animate-fade-in-up drop-shadow-md" style={{ animationDelay: '0.2s' }}>
          {subtitle}
        </p>
        
        {/* Search Card */}
        <div className="glassmorphism rounded-full p-3 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-5 w-5 h-5 text-blue-500 z-10" />
              <input
                type="text"
                placeholder="어디로 떠나고 싶으세요?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-transparent text-gray-700 text-lg outline-none placeholder-gray-500 text-center md:text-left"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              검색
            </button>
          </form>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-400">50+</div>
            <div className="text-sm opacity-90">여행 국가</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-400">1000+</div>
            <div className="text-sm opacity-90">여행 패키지</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-400">10,000+</div>
            <div className="text-sm opacity-90">만족한 고객</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-400">15년</div>
            <div className="text-sm opacity-90">신뢰의 경험</div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/10 text-white/30 text-2xl animate-float">✈️</div>
        <div className="absolute top-3/5 right-1/6 text-white/30 text-2xl animate-float" style={{ animationDelay: '2s' }}>🏖️</div>
        <div className="absolute bottom-1/4 left-1/5 text-white/30 text-2xl animate-float" style={{ animationDelay: '4s' }}>🗻</div>
      </div>
    </section>
  )
}

export default Hero
