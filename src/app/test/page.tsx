'use client'

import { useState } from 'react'

export default function TestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data
      })
    } catch (error) {
      setResult({ 
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        type: 'fetch_error'
      })
    } finally {
      setLoading(false)
    }
  }

  const testSignup = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '테스트유저',
          email: `test${Date.now()}@example.com`, // 중복 방지
          phone: '010-1234-5678',
          password: 'test123456',
          agreeTerms: true,
          agreePrivacy: true,
          agreeMarketing: false
        })
      })
      const data = await response.json()
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data
      })
    } catch (error) {
      setResult({ 
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        type: 'fetch_error'
      })
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123456'
        })
      })
      const data = await response.json()
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data
      })
    } catch (error) {
      setResult({ 
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        type: 'fetch_error'
      })
    } finally {
      setLoading(false)
    }
  }

  const testEnvironment = () => {
    setResult({
      type: 'environment_check',
      client_env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">API 및 데이터베이스 테스트</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={testEnvironment}
            disabled={loading}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            환경변수 확인
          </button>
          
          <button
            onClick={testHealth}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '테스트 중...' : '데이터베이스 연결 테스트'}
          </button>
          
          <button
            onClick={testSignup}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? '테스트 중...' : '회원가입 테스트'}
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? '테스트 중...' : '로그인 테스트'}
          </button>
        </div>
        
        {result && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">테스트 결과</h2>
            <div className="space-y-2 mb-4">
              {result.status && (
                <div className={`inline-block px-3 py-1 rounded text-sm ${
                  result.status >= 200 && result.status < 300 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  Status: {result.status} {result.statusText}
                </div>
              )}
            </div>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
