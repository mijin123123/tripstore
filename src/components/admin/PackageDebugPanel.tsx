import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  ExternalLink, 
  PackageOpen, 
  ArrowUpToLine 
} from 'lucide-react';

export default function PackageDebugPanel() {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [packageInfo, setPackageInfo] = useState<any>(null);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({
    db: false,
    packages: false,
    import: false
  });
  const [error, setError] = useState('');

  // DB 상태 확인
  const checkDbStatus = async () => {
    setLoading(prev => ({ ...prev, db: true }));
    setError('');
    
    try {
      const res = await fetch('/api/admin/db-status');
      
      if (!res.ok) {
        throw new Error(`API 응답 오류: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      setDbStatus(data);
      
      // DB가 정상이면 패키지 정보도 가져옴
      if (data.status === 'ok') {
        checkPackages();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      console.error('DB 상태 확인 중 오류:', err);
    } finally {
      setLoading(prev => ({ ...prev, db: false }));
    }
  };
  
  // 패키지 정보 확인
  const checkPackages = async () => {
    setLoading(prev => ({ ...prev, packages: true }));
    
    try {
      const res = await fetch('/api/packages?_debug=1');
      
      if (!res.ok) {
        throw new Error(`패키지 API 오류: ${res.status}`);
      }
      
      const packages = await res.json();
      
      setPackageInfo({
        count: Array.isArray(packages) ? packages.length : 0,
        firstPackage: Array.isArray(packages) && packages.length > 0 ? packages[0] : null,
        timestamp: new Date().toISOString()
      });
      
      return packages;
    } catch (err) {
      console.error('패키지 확인 오류:', err);
      setPackageInfo({
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString()
      });
      return null;
    } finally {
      setLoading(prev => ({ ...prev, packages: false }));
    }
  };
  
  // 메인 패키지 가져오기
  const importMainPackages = async (force = false) => {
    setLoading(prev => ({ ...prev, import: true }));
    
    try {
      const res = await fetch('/api/admin/import-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force })
      });
      
      if (!res.ok) {
        throw new Error(`가져오기 API 오류: ${res.status}`);
      }
      
      const result = await res.json();
      
      if (result.success) {
        // 성공하면 패키지 정보 새로고침
        await checkPackages();
        return { success: true, message: `${result.count || 0}개 패키지 가져옴` };
      } else if (result.existingCount && !force) {
        return { 
          success: false, 
          existingCount: result.existingCount,
          message: `${result.existingCount}개 패키지가 이미 존재함`
        };
      } else {
        throw new Error(result.error || '알 수 없는 오류');
      }
    } catch (err) {
      console.error('패키지 가져오기 오류:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : String(err)
      };
    } finally {
      setLoading(prev => ({ ...prev, import: false }));
    }
  };

  // Neon 콘솔 열기
  const openNeonConsole = () => {
    window.open('https://console.neon.tech', '_blank');
  };
  
  // 컴포넌트 마운트 시 DB 상태 확인
  useEffect(() => {
    checkDbStatus();
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Database size={18} /> 관리자 디버그 패널
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="db">
        <div className="px-6 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="db" className="flex-1">DB 상태</TabsTrigger>
            <TabsTrigger value="packages" className="flex-1">패키지</TabsTrigger>
            <TabsTrigger value="actions" className="flex-1">작업</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle size={16} />
              <AlertTitle>오류 발생</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <TabsContent value="db" className="m-0">
            <div className="space-y-4">
              {dbStatus ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <strong>상태:</strong>
                      {dbStatus.status === 'ok' ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle size={16} /> 정상
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertCircle size={16} /> 오류
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {dbStatus.timestamp && new Date(dbStatus.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {dbStatus.connection?.suspendedDetected && (
                    <Alert variant="warning" className="bg-amber-50 border-amber-200">
                      <AlertTitle className="text-amber-800">중요: Neon DB 브랜치가 정지됨</AlertTitle>
                      <AlertDescription className="text-amber-700">
                        Neon DB 브랜치가 SUSPENDED 상태입니다. 콘솔에서 활성화해주세요.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {dbStatus.packageCount !== undefined && (
                    <div className="text-sm">
                      현재 패키지 수: <strong>{dbStatus.packageCount}</strong>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 text-center py-2">
                  DB 상태를 확인하려면 새로고침 버튼을 클릭하세요.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="packages" className="m-0">
            <div className="space-y-4">
              {packageInfo ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>패키지 수:</strong> {packageInfo.count || 0}
                    </div>
                    <div className="text-sm text-gray-500">
                      {packageInfo.timestamp && new Date(packageInfo.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {packageInfo.error && (
                    <Alert variant="destructive">
                      <AlertTitle>패키지 불러오기 실패</AlertTitle>
                      <AlertDescription>{packageInfo.error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {packageInfo.firstPackage && (
                    <div className="text-xs mt-2 p-2 bg-gray-50 rounded border overflow-auto max-h-40">
                      <div className="font-medium mb-1">첫 번째 패키지 샘플:</div>
                      <pre className="whitespace-pre-wrap break-all">
                        {JSON.stringify(packageInfo.firstPackage, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 text-center py-2">
                  패키지 정보를 확인하려면 새로고침 버튼을 클릭하세요.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="m-0">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  onClick={async () => {
                    const result = await importMainPackages();
                    if (!result.success && result.existingCount) {
                      if (window.confirm(`이미 ${result.existingCount}개의 패키지가 존재합니다. 모두 삭제하고 새로 가져오시겠습니까?`)) {
                        await importMainPackages(true);
                      }
                    } else {
                      alert(result.success 
                        ? result.message 
                        : `오류: ${result.error || '알 수 없는 오류'}`);
                    }
                  }}
                  disabled={loading.import}
                  className="flex items-center gap-2"
                >
                  {loading.import ? <RefreshCw className="animate-spin" size={16} /> : <ArrowUpToLine size={16} />}
                  메인 사이트 패키지 가져오기
                </Button>
                
                {dbStatus?.connection?.suspendedDetected && (
                  <Button
                    variant="outline"
                    onClick={openNeonConsole}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    Neon DB 콘솔 열기
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="bg-gray-50 border-t flex justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={checkDbStatus}
          disabled={loading.db}
        >
          {loading.db ? <RefreshCw className="animate-spin" size={14} /> : <RefreshCw size={14} />}
          <span className="ml-1">새로고침</span>
        </Button>
        
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Database size={12} />
          <span>Neon PostgreSQL</span>
        </div>
      </CardFooter>
    </Card>
  );
}
