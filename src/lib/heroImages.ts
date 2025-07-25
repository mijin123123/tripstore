import { createClient } from './supabase'

export interface HeroImage {
  id: number
  page_type: string
  page_slug: string | null
  title: string
  subtitle: string | null
  image_url: string
  gradient_overlay: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getHeroImage(pageType: string, pageSlug?: string): Promise<HeroImage | null> {
  try {
    const supabase = createClient()
    
    let query = supabase
      .from('hero_images')
      .select('*')
      .eq('page_type', pageType)
      .eq('is_active', true)
    
    if (pageSlug) {
      query = query.eq('page_slug', pageSlug)
    } else {
      query = query.is('page_slug', null)
    }
    
    const { data, error } = await query.single()
    
    if (error) {
      console.error('히어로 이미지 불러오기 오류:', error)
      return null
    }
    
    return data as HeroImage
  } catch (error) {
    console.error('히어로 이미지 불러오기 실패:', error)
    return null
  }
}

export async function getAllHeroImages(): Promise<HeroImage[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .eq('is_active', true)
      .order('page_type')
      .order('page_slug', { nullsFirst: true })
    
    if (error) {
      console.error('모든 히어로 이미지 불러오기 오류:', error)
      return []
    }
    
    return data as HeroImage[]
  } catch (error) {
    console.error('모든 히어로 이미지 불러오기 실패:', error)
    return []
  }
}
