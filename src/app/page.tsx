import Hero from '@/components/Hero'
import FeaturedPackages from '@/components/FeaturedPackages'
import About from '@/components/About'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedPackages />
      <About />
    </div>
  )
}
