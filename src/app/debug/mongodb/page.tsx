'use client';

import { useState, useEffect } from 'react';

export default function MongoDBStatusPage() {
  const [status, setStatus] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    const checkMongoDBStatus = async () => {
      try {
        setStatus({ loading: true, data: null, error: null });
        
        const response = await fetch('/api/debug/mongodb');
        const data = await response.json();
        
        setStatus({ loading: false, data, error: null });
      } catch (error) {
        setStatus({ loading: false, data: null, error: error.message });
      }
    };

    checkMongoDBStatus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">MongoDB 서버 상태 확인</h1>
      
      {status.loading && (
        <div className="p-4 rounded bg-blue-50 text-blue-700">
          데이터베이스 연결 상태를 확인하는 중...
        </div>
      )}
      
      {status.error && (
        <div className="p-4 rounded bg-red-50 text-red-700">
          <h2 className="font-bold">오류 발생:</h2>
          <p className="mt-2">{status.error}</p>
        </div>
      )}
      
      {status.data && (
        <div className={`p-6 rounded border ${
          status.data.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <h2 className="font-bold text-xl mb-4">
            상태: {status.data.status === 'success' ? '연결 성공 ✅' : '연결 실패 ❌'}
          </h2>
          
          <p className="mb-3">{status.data.message}</p>
          
          {status.data.error && (
            <div className="mt-4 p-3 bg-red-100 rounded">
              <h3 className="font-bold">오류 메시지:</h3>
              <p className="font-mono text-sm mt-2">{status.data.error}</p>
            </div>
          )}
          
          {status.data.env && (
            <div className="mt-6">
              <h3 className="font-bold mb-2">환경 정보:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>환경: {status.data.env.node_env}</li>
                <li>MongoDB URI 설정: {status.data.env.mongodb_uri_set ? '예' : '아니오'}</li>
                <li>JWT Secret 설정: {status.data.env.jwt_secret_set ? '예' : '아니오'}</li>
                <li>실행 환경: {status.data.env.runtime}</li>
                <li>확인 시간: {new Date(status.data.env.timestamp).toLocaleString()}</li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8">
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
        >
          다시 확인하기
        </button>
      </div>
    </div>
  );
}
