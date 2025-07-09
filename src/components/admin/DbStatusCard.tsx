import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Database, ExternalLink, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function DbStatusCard({ onRefresh }: { onRefresh?: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [error, setError] = useState('');

  const checkDbStatus = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/db-status');
      
      if (!res.ok) {
        throw new Error(`API 응답 오류: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      setDbStatus(data);
      
      // 새로고침 콜백이 제공된 경우 호출
      if (onRefresh && data.status === 'ok') {
        await onRefresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      console.error('DB 상태 확인 중 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const openNeonDashboard = () => {
    window.open('https://console.neon.tech', '_blank');
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database size={20} /> 데이터베이스 상태
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류 발생</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {dbStatus ? (
          <div className="space-y-3">
            {dbStatus.status === 'ok' ? (
              <div className="text-green-600">
                ✅ DB 연결됨 
                {dbStatus.packageCount !== undefined && (
                  <span className="ml-2 text-sm text-gray-600">
                    (패키지 {dbStatus.packageCount}개)
                  </span>
                )}
              </div>
            ) : (
              <div className="text-red-600">
                ⚠️ DB 연결 실패: {dbStatus.message}
              </div>
            )}
            
            {dbStatus.connection?.suspendedDetected && (
              <Alert className="bg-amber-50 text-amber-900 border-amber-200">
                <AlertTitle>Neon DB 브랜치가 중지됨</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>Neon DB 브랜치가 SUSPENDED 상태입니다. 콘솔에서 활성화해주세요.</p>
                  <Button variant="outline" size="sm" onClick={openNeonDashboard}>
                    <ExternalLink size={14} className="mr-1" /> Neon 콘솔 열기
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {dbStatus.timestamp && (
              <div className="text-xs text-gray-500">
                마지막 확인: {new Date(dbStatus.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">DB 상태를 확인하려면 버튼을 클릭하세요</div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={checkDbStatus} 
          disabled={loading}
          className="w-full"
        >
          {loading ? <RefreshCw className="animate-spin mr-2" size={16} /> : <RefreshCw size={16} className="mr-2" />}
          DB 상태 확인
        </Button>
      </CardFooter>
    </Card>
  );
}
