import { createClient } from '@/lib/supabase'

async function getPaymentSettings() {
  const supabase = createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .eq('setting_group', 'payment')
  
  const settings: Record<string, string> = {}
  data?.forEach((item: { setting_key: string, setting_value: string | null }) => {
    settings[item.setting_key] = item.setting_value || ''
  })
  
  return settings
}

export default async function PaymentInfo() {
  const paymentSettings = await getPaymentSettings()
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">결제 정보</h3>
      <div className="space-y-1 text-sm text-gray-700">
        <p>
          <span className="font-medium">입금 계좌:</span>{' '}
          {paymentSettings.payment_bank_name || '신한은행'}{' '}
          {paymentSettings.payment_account_number || '123-456-789012'}{' '}
          ({paymentSettings.payment_account_holder || '트립스토어(주)'})
        </p>
        {paymentSettings.payment_instruction && (
          <p className="text-blue-600">
            <span className="font-medium">안내:</span> {paymentSettings.payment_instruction}
          </p>
        )}
        {paymentSettings.payment_confirmation_time && (
          <p>
            <span className="font-medium">입금확인:</span> {paymentSettings.payment_confirmation_time}
          </p>
        )}
      </div>
    </div>
  )
}
