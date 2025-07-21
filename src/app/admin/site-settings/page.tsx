'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Save } from 'lucide-react'

type SiteSetting = {
  id: number
  setting_key: string
  setting_value: string | null
  setting_group: string
  description: string | null
  created_at: string
  updated_at: string
}

type GroupedSettings = {
  [key: string]: {
    [key: string]: SiteSetting
  }
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [groupedSettings, setGroupedSettings] = useState<GroupedSettings>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('footer')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('setting_group')
        .order('id')
        
      if (error) throw error
      setSettings(data || [])

      // 그룹별로 설정 분류
      const grouped: GroupedSettings = {}
      data?.forEach(setting => {
        if (!grouped[setting.setting_group]) {
          grouped[setting.setting_group] = {}
        }
        grouped[setting.setting_group][setting.setting_key] = setting
      })
      setGroupedSettings(grouped)
    } catch (err: any) {
      setError(`설정을 불러오는데 실패했습니다: ${err.message}`)
      console.error('설정 불러오기 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (settingKey: string, value: string, group: string) => {
    setGroupedSettings(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [settingKey]: {
          ...prev[group][settingKey],
          setting_value: value
        }
      }
    }))
  }

  const handleSaveSettings = async (group: string) => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)
      
      const supabase = createClient()
      const settingsToUpdate = Object.values(groupedSettings[group] || {})
      
      for (const setting of settingsToUpdate) {
        const { error } = await supabase
          .from('site_settings')
          .update({ 
            setting_value: setting.setting_value,
            updated_at: new Date().toISOString()
          })
          .eq('id', setting.id)
        
        if (error) throw error
      }
      
      setSuccess(`${group === 'footer' ? '푸터' : '결제'} 설정이 성공적으로 저장되었습니다.`)
    } catch (err: any) {
      setError(`설정 저장에 실패했습니다: ${err.message}`)
      console.error('설정 저장 오류:', err)
    } finally {
      setIsSaving(false)
      
      // 3초 후 성공 메시지 삭제
      if (success) {
        setTimeout(() => {
          setSuccess(null)
        }, 3000)
      }
    }
  }

  const getGroupDisplayName = (group: string) => {
    switch (group) {
      case 'footer': return '푸터 정보';
      case 'payment': return '결제 정보';
      default: return group;
    }
  }

  const getSettingDisplayName = (key: string) => {
    // setting_key를 표시 이름으로 변환
    const keyMap: Record<string, string> = {
      // 푸터 정보
      'footer_company_name': '회사명',
      'footer_ceo': '대표자',
      'footer_business_number': '사업자등록번호',
      'footer_mail_order_business': '통신판매업신고번호',
      'footer_address': '주소',
      'footer_tel': '전화번호',
      'footer_email': '이메일',
      'footer_customer_service_hours': '고객센터 운영시간',
      'footer_copyright': '저작권 정보',
      
      // 결제 정보
      'payment_bank_name': '은행명',
      'payment_account_number': '계좌번호',
      'payment_account_holder': '예금주',
      'payment_instruction': '입금 안내',
      'payment_confirmation_time': '입금 확인 소요시간',
    }
    
    return keyMap[key] || key
  }

  const tabs = [
    { id: 'footer', name: '푸터 정보' },
    { id: 'payment', name: '결제 정보' }
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">사이트 설정</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'footer' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">푸터 정보 설정</h2>
                <p className="text-gray-600">웹사이트 하단에 표시되는 회사 정보와 저작권 정보를 관리합니다.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(groupedSettings['footer'] || {}).map(setting => (
                    <div key={setting.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {getSettingDisplayName(setting.setting_key)}
                      </label>
                      {setting.setting_key === 'footer_address' ? (
                        <textarea
                          value={setting.setting_value || ''}
                          onChange={(e) => handleInputChange(setting.setting_key, e.target.value, 'footer')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      ) : (
                        <input
                          type="text"
                          value={setting.setting_value || ''}
                          onChange={(e) => handleInputChange(setting.setting_key, e.target.value, 'footer')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      {setting.description && (
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => handleSaveSettings('footer')}
                    disabled={isSaving}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center ${
                      isSaving ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {isSaving ? '저장 중...' : '저장하기'}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">결제 정보 설정</h2>
                <p className="text-gray-600">예약 시 사용되는 계좌 정보와 입금 관련 안내 사항을 관리합니다.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(groupedSettings['payment'] || {}).map(setting => (
                    <div key={setting.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {getSettingDisplayName(setting.setting_key)}
                      </label>
                      {setting.setting_key === 'payment_instruction' ? (
                        <textarea
                          value={setting.setting_value || ''}
                          onChange={(e) => handleInputChange(setting.setting_key, e.target.value, 'payment')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      ) : (
                        <input
                          type="text"
                          value={setting.setting_value || ''}
                          onChange={(e) => handleInputChange(setting.setting_key, e.target.value, 'payment')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      {setting.description && (
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => handleSaveSettings('payment')}
                    disabled={isSaving}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center ${
                      isSaving ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {isSaving ? '저장 중...' : '저장하기'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
