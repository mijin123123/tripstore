"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Database, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Clock, 
  ExternalLink 
} from 'lucide-react';

export default function DbHealthCheck() {
  const [dbStatus, setDbStatus] = useState<{
    isConnected: boolean;
    lastChecked?: string;
    suspendedDetected?: boolean;
    timestamp?: string;
    hint?: string;
    error?: string;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // DB 상태 확인 함수
  const checkDbStatus = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/health/db');
      
      if (!res.ok) {
        throw new Error(`API 응답 오류: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      console.error('DB 상태 확인 중 오류 발생:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 페이지 로드 시 자동 확인
  useEffect(() => {
    checkDbStatus();
    
    // 주기적인 상태 확인 (5분마다)
    const interval = setInterval(() => {
      checkDbStatus();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Neon 대시보드 링크 열기
  const openNeonDashboard = () => {
    window.open('https://console.neon.tech', '_blank');
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex items-center gap-2">
          <Database size={20} /> 데이터베이스 상태 확인
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle size={16} />
            <AlertTitle>오류 발생</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        
        {dbStatus ? (
          <div className="space-y-4">
            {/* 연결 상태 */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <strong>연결 상태:</strong>
                {dbStatus.isConnected ? (
                  <span className="flex items-center text-green-600 gap-1">
                    <CheckCircle size={16} /> 정상
                  </span>
                ) : (
                  <span className="flex items-center text-red-600 gap-1">
                    <XCircle size={16} /> 연결 실패
                  </span>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkDbStatus} 
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                <span className="ml-1">새로 고침</span>
              </Button>
            </div>
            
            {/* SUSPENDED 상태 알림 */}
            {dbStatus.suspendedDetected && (
              <Alert variant="destructive" className="mb-3">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Neon DB 브랜치가 정지되었습니다!</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">Neon DB 브랜치가 SUSPENDED 상태입니다. 콘솔에서 브랜치를 활성화해주세요.</p>
                  <Button variant="destructive" size="sm" onClick={openNeonDashboard}>
                    <ExternalLink size={14} className="mr-1" /> Neon 대시보드 열기
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {/* 마지막 확인 시간 */}
            {dbStatus.timestamp && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>마지막 확인: {new Date(dbStatus.timestamp).toLocaleString()}</span>
              </div>
            )}
            
            {/* 추가 힌트 표시 */}
            {dbStatus.hint && (
              <div className="text-sm bg-blue-50 p-2 rounded border border-blue-200 text-blue-800">
                {dbStatus.hint}
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-24">
            <RefreshCw className="animate-spin" />
            <span className="ml-2">DB 상태 확인 중...</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 justify-between border-t text-sm text-gray-500 flex">
        <div>
          데이터베이스: <span className="font-mono">Neon PostgreSQL</span>
        </div>
        {dbStatus?.lastChecked && (
          <div>
            자동 확인 주기: 5분
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
