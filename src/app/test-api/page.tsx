"use client";

import { useState, useEffect } from 'react';

export default function TestAPI() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 API 테스트 시작...');
      
      const response = await fetch('/api/packages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 응답:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📥 데이터:', data);
      
      setResult({
        status: response.status,
        dataType: typeof data,
        isArray: Array.isArray(data),
        length: Array.isArray(data) ? data.length : Object.keys(data).length,
        data: data
      });
      
    } catch (err) {
      console.error('❌ 에러:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">API 테스트</h1>
      
      <button 
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {loading ? '테스트 중...' : 'API 다시 테스트'}
      </button>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          에러: {error}
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold">API 응답 성공!</h2>
          <p>상태: {result.status}</p>
          <p>데이터 타입: {result.dataType}</p>
          <p>배열 여부: {result.isArray ? 'YES' : 'NO'}</p>
          <p>데이터 크기: {result.length}</p>
          
          {result.isArray && result.data.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold">첫 번째 패키지:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(result.data[0], null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
