import Hero from '@/components/Hero'
import FeaturedPackages from '@/components/FeaturedPackages'
import About from '@/components/About'
import Reviews from '@/components/Reviews'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedPackages />
      <Reviews />
      <About />
    </div>
  )
}
