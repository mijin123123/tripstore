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
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)

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
  
  // 이미지 파일을 Base64로 변환하는 함수
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  
  // 이미지 파일 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, settingKey: string, group: string) => {
    try {
      setImageUploadError(null);
      const file = e.target.files?.[0];
      
      if (!file) return;
      
      // 파일 크기 제한 (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageUploadError("파일 크기는 2MB를 초과할 수 없습니다.");
        return;
      }
      
      // 이미지 파일 유형 확인
      if (!file.type.startsWith('image/')) {
        setImageUploadError("이미지 파일만 업로드할 수 있습니다.");
        return;
      }
      
      // 이미지를 Base64로 변환
      const base64Image = await convertImageToBase64(file);
      
      // 상태 업데이트
      handleInputChange(settingKey, base64Image, group);
    } catch (err: any) {
      console.error("이미지 업로드 오류:", err);
      setImageUploadError("이미지 업로드 중 오류가 발생했습니다.");
    }
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
      'footer_kakao_qr': '카카오톡 QR코드 URL',
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
                      ) : setting.setting_key === 'footer_kakao_qr' ? (
                        <div className="space-y-3">
                          <div className="flex flex-col gap-2">
                            <input
                              type="file"
                              id={`file-${setting.id}`}
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, setting.setting_key, 'footer')}
                            />
                            <div className="flex gap-2">
                              <label 
                                htmlFor={`file-${setting.id}`}
                                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md cursor-pointer hover:bg-blue-200 transition-colors"
                              >
                                QR코드 이미지 선택
                              </label>
                              {setting.setting_value && (
                                <button
                                  type="button"
                                  onClick={() => handleInputChange(setting.setting_key, '', 'footer')}
                                  className="px-4 py-2 bg-red-100 text-red-600 rounded-md cursor-pointer hover:bg-red-200 transition-colors"
                                >
                                  이미지 삭제
                                </button>
                              )}
                            </div>
                            {imageUploadError && (
                              <p className="text-xs text-red-500">{imageUploadError}</p>
                            )}
                            <p className="text-xs text-gray-500">최대 파일 크기: 2MB, 권장 크기: 200x200px</p>
                          </div>
                          
                          {setting.setting_value && (
                            <div className="mt-2 bg-gray-50 p-2 rounded border w-32 h-32">
                              <img 
                                src={setting.setting_value} 
                                alt="카카오톡 QR 코드 미리보기" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
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
