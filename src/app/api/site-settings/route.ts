import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 환경변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase 환경변수가 설정되지 않았습니다')
}

const supabase = createClient(supabaseUrl!, supabaseKey!)

export async function GET() {
  try {
    console.log('사이트 설정 조회 API 호출됨')
    
    // Supabase에서 사이트 설정 데이터 가져오기
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('setting_group')
      .order('id')

    if (error) {
      console.error('데이터베이스 조회 오류:', error)
      return NextResponse.json(
        { error: '사이트 설정 조회 중 오류가 발생했습니다.', details: error.message },
        { status: 500 }
      )
    }

    console.log(`총 ${data?.length || 0}개의 설정을 찾았습니다.`)
    
    // 설정을 그룹별로 정리
    const groupedSettings: { [key: string]: { [key: string]: any } } = {}
    
    data?.forEach(setting => {
      if (!groupedSettings[setting.setting_group]) {
        groupedSettings[setting.setting_group] = {}
      }
      groupedSettings[setting.setting_group][setting.setting_key] = setting.setting_value
    })

    return NextResponse.json({ 
      settings: data || [],
      grouped: groupedSettings
    }, { status: 200 })

  } catch (error) {
    console.error('사이트 설정 조회 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    console.log('사이트 설정 업데이트 API 호출됨')
    
    const body = await request.json()
    console.log('받은 업데이트 데이터:', JSON.stringify(body, null, 2))

    const { setting_key, setting_value, setting_group } = body

    // 필수 필드 검증
    if (!setting_key) {
      return NextResponse.json(
        { error: 'setting_key는 필수입니다.' },
        { status: 400 }
      )
    }

    // Supabase에서 설정 업데이트
    const { data, error } = await supabase
      .from('site_settings')
      .update({ 
        setting_value: setting_value,
        updated_at: new Date().toISOString()
      })
      .eq('setting_key', setting_key)
      .select()

    if (error) {
      console.error('데이터베이스 업데이트 오류:', error)
      return NextResponse.json(
        { error: '사이트 설정 업데이트 중 오류가 발생했습니다.', details: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: '해당 설정을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    console.log('업데이트 성공:', data[0])
    return NextResponse.json(
      { 
        message: '설정이 성공적으로 업데이트되었습니다.',
        setting: data[0]
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('사이트 설정 업데이트 API 오류:', error)
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
