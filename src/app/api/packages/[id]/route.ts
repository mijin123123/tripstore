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
    
    // 일정 데이터 디버깅
    console.log('API에서 받은 일정 데이터:', {
      id: data.id,
      title: data.title,
      itinerary: data.itinerary,
      itineraryType: typeof data.itinerary,
      isArray: Array.isArray(data.itinerary),
      length: Array.isArray(data.itinerary) ? data.itinerary.length : 'N/A'
    });

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
      // 일정 데이터를 그대로 전달 (기본값 설정하지 않음)
      itinerary: data.itinerary || []
    }

    console.log('정규화된 일정 데이터:', normalizedData.itinerary);
    
    return Response.json(normalizedData)
  } catch (error: any) {
    console.error('API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
