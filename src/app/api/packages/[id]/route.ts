import { createClient } from '@/lib/supabase'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop()
  
  if (!id) {
    return Response.json({ error: 'Package ID is required' }, { status: 400 })
  }
  
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }
    
    if (!data) {
      return Response.json({ error: 'Package not found' }, { status: 404 })
    }
    
    // 데이터 정규화
    const normalizedData = {
      ...data,
      title: data.title || data.name,
      regionKo: data.region_ko || data.region,
      name: data.title || data.name,
      category: data.type || data.category,
      images: Array.isArray(data.images) ? data.images : [],
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      included: Array.isArray(data.included) ? data.included : [],
      excluded: Array.isArray(data.excluded) ? data.excluded : [],
      notes: Array.isArray(data.notes) ? data.notes : [],
      itinerary: Array.isArray(data.itinerary) && data.itinerary.length > 0 
        ? data.itinerary 
        : [
            {
              day: 1,
              title: "여행 시작",
              description: "상세 일정이 곧 업데이트될 예정입니다.",
              accommodation: "",
              meals: { breakfast: false, lunch: false, dinner: false }
            }
          ]
    }
    
    return Response.json(normalizedData)
  } catch (error: any) {
    console.error('API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
