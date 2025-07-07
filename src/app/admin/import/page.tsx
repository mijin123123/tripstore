// 이 페이지는 개발 환경에서만 접근 가능합니다.
// 관리자 페이지를 통해 샘플 데이터를 등록하기 위한 개발용 페이지입니다.

"use client";

import { useState, useEffect } from 'react';
import { packagesData } from '@/data/packagesData';

export default function ImportDemoDataPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const importPackages = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'import_demo_data',
          packagesData: packagesData
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`성공: ${data.message}`);
      } else {
        setError(`오류: ${data.error || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error('데이터 가져오기 중 오류 발생:', error);
      setError(`예외 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">데모 데이터 가져오기</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          이 페이지는 <strong>데모 데이터를 데이터베이스에 가져오기 위한 개발용 페이지</strong>입니다.
          실 환경에서는 접근할 수 없도록 해야 합니다.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <p className="text-blue-700">
            packagesData.ts에서 {packagesData.length}개의 패키지 데이터를 찾았습니다.
          </p>
        </div>
        
        <button
          onClick={importPackages}
          disabled={isLoading}
          className={`px-4 py-2 rounded font-medium ${
            isLoading 
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? '가져오는 중...' : '패키지 데이터 가져오기'}
        </button>
      </div>
      
      {result && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <p className="text-green-700">{result}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
