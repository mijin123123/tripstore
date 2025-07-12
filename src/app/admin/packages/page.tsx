"use client";

import { useState, useEffect } from "react";
import PackageItem from "@/components/admin/PackageItem";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import DbStatusCard from "@/components/admin/DbStatusCard";

interface PackageData {
  id: string;
  [key: string]: any;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        console.log('패키지 데이터 요청 시작...');
        
        // 브라우저 환경에서는 직접 DB 접근이 불가능하므로 API만 사용
        // 직접 DB 접근 코드 제거 (보안 및 환경 제약으로 인해)
        
        // 방법 1: 내장 데이터 사용 (API가 실패할 경우 대비)
        const fallbackData = (await import('@/data/packagesData')).packagesData.map(p => ({
          ...p,
          id: p.id || crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        // 방법 2: API 사용 (최적화 버전)
        try {
          console.log('API를 통한 데이터 요청 시도...');
          const response = await fetch('/api/packages', {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          });
          
          console.log(`API 응답 상태: ${response.status} ${response.statusText}`);
          
          if (!response.ok) {
            throw new Error(`패키지 데이터를 불러오는데 실패했습니다. 상태 코드: ${response.status}`);
          }
          
          // 응답 데이터 파싱
          // API에서 성공적으로 데이터를 가져온 경우
          if (Array.isArray(data)) {
            console.log(`데이터 배열 길이: ${data.length}개의 패키지`);
            setPackages(data);
          } else {
            console.error('예상치 못한 API 응답 형식:', data);
            setError('API 응답 형식이 올바르지 않습니다.');
            setDebugInfo(data);
            // 내장 데이터로 폴백
            setPackages(fallbackData);
          }
        } catch (apiError) {
          console.error('API를 통한 패키지 데이터 조회 실패:', apiError);
          console.log('내장 패키지 데이터로 대체합니다.');
          
          // API 호출 실패시 내장 데이터 사용
          setPackages(fallbackData);
          setDebugInfo({ apiError: apiError instanceof Error ? apiError.message : String(apiError) });
        }
      } catch (err) {
        console.error('패키지 데이터 조회 오류:', err);
        setError(`패키지 데이터를 불러올 수 없습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
        
        // 모든 방법 실패시 빈 배열
        setPackages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, []);

  if (loading) {
    return <div className="p-6">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 text-red-600">{error}</div>
        
        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-sm font-bold mb-2">디버그 정보:</h3>
            <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
            
            <div className="mt-4">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={importMainPackages}
              >
                메인 사이트 패키지 가져오기
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // 메인 사이트 패키지를 가져오는 함수
  const importMainPackages = async (force = false) => {
    try {
      setLoading(true);
      setError('');
      
      // 동적으로 adminImport 모듈 가져오기
      const { importPackagesToAdmin } = await import('@/utils/adminImport');
      console.log('관리자 페이지에서 패키지 가져오기 시작...');
      console.log('강제 덮어쓰기 옵션:', force);
      
      const result = await importPackagesToAdmin({ force });
      console.log('패키지 가져오기 결과:', result);
      
      if (result?.success) {
        // 성공 알림
        alert(`성공: ${result.message || '패키지를 성공적으로 가져왔습니다.'}`);
        
        // 데이터 다시 로드
        const response = await fetch('/api/packages', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Timestamp': new Date().getTime().toString() // 캐시 방지용 타임스탬프
          }
        });
        
        console.log(`새로운 패키지 데이터 요청 상태: ${response.status}`);
        
        if (!response.ok) {
          throw new Error(`패키지 데이터를 불러오는데 실패했습니다. 상태: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`가져온 패키지 데이터 개수: ${data.length}`);
        
        // 데이터 업데이트
        setPackages(data);
      } else if (result?.existingCount && result?.existingCount > 0) {
        // 이미 데이터가 존재하는 경우
        if (confirm(`이미 ${result.existingCount}개의 패키지가 DB에 존재합니다. 모두 삭제하고 새로 가져오시겠습니까?`)) {
          // 강제 덮어쓰기 모드로 다시 시도
          importMainPackages(true);
          return;
        } else {
          alert('가져오기가 취소되었습니다.');
        }
      } else {
        // 오류 또는 안내 메시지
        const errorMsg = result?.message || result?.error || '패키지를 가져오는데 실패했습니다.';
        console.warn('패키지 가져오기 안내:', errorMsg);
        
        // 자세한 오류 정보가 있으면 표시
        if (result?.details) {
          console.error('오류 상세:', result.details);
          setDebugInfo({
            error: errorMsg,
            details: result.details,
            timestamp: new Date().toISOString()
          });
        }
        
        alert(errorMsg);
      }
    } catch (err) {
      console.error('패키지 가져오기 오류:', err);
      setError(`패키지 가져오기 오류: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
      alert('패키지를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">패키지 관리</h1>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              if (confirm("메인 사이트의 패키지 데이터를 가져오시겠습니까? 기존 데이터는 모두 삭제됩니다.")) {
                importMainPackages(true); // 항상 강제 덮어쓰기 옵션 사용
              }
            }}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            메인 사이트 패키지 가져오기
          </Button>
          
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                // DB 상태 확인
                const dbResponse = await fetch('/api/debug/db-status');
                const dbStatus = await dbResponse.json();
                console.log('DB 상태 확인:', dbStatus);
                
                if (!dbStatus.connectionTest?.success) {
                  alert(`DB 연결 실패: ${dbStatus.connectionTest?.error || '알 수 없는 오류'}`);
                  return;
                }
                
                alert(`DB 연결 성공! 현재 패키지 수: ${dbStatus.connectionTest?.packageCount || 0}`);
              } catch (err) {
                console.error('DB 상태 확인 오류:', err);
                alert('DB 상태 확인 중 오류가 발생했습니다.');
              }
            }}
            disabled={loading}
          >
            DB 연결 확인
          </Button>
          
          <Button 
            variant="outline" 
            onClick={async () => {
              if (confirm("경고: 이 작업은 메인 사이트 패키지를 직접 DB에 동기화합니다. 기존 데이터는 모두 삭제됩니다. 계속하시겠습니까?")) {
                setLoading(true);
                try {
                  // 패키지 목록 새로고침을 통해 동기화
                  const response = await fetch('/api/packages', {
                    method: 'GET',
                    headers: {
                      'Cache-Control': 'no-cache',
                    },
                  });
                  
                  if (!response.ok) {
                    throw new Error(`동기화 실패: ${response.status}`);
                  }
                  
                  const result = await response.json();
                  alert(`동기화 성공! ${result.count || 0}개의 패키지가 추가되었습니다.`);
                  
                  // 페이지 새로고침하여 변경사항 반영
                  window.location.reload();
                } catch (error) {
                  console.error('패키지 동기화 오류:', error);
                  alert(`패키지 동기화 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
                } finally {
                  setLoading(false);
                }
              }
            }}
            disabled={loading}
            className="bg-blue-50 hover:bg-blue-100"
          >
            데이터 직접 동기화
          </Button>

          <Button
            variant="outline"
            onClick={async () => {
              try {
                // DB 상태 확인
                const dbResponse = await fetch('/api/debug/db-status');
                const dbStatus = await dbResponse.json();
                console.log('DB 상태 확인:', dbStatus);
                
                if (!dbStatus.connectionTest?.success) {
                  alert(`DB 연결 실패: ${dbStatus.connectionTest?.error || '알 수 없는 오류'}`);
                  return;
                }
                
                alert(`DB 연결 성공! 현재 패키지 수: ${dbStatus.connectionTest?.packageCount || 0}`);
              } catch (err) {
                console.error('DB 상태 확인 오류:', err);
                alert('DB 상태 확인 중 오류가 발생했습니다.');
              }
            }}
          >
            DB 연결 확인
          </Button>
          
          <Link href="/admin/packages/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>새 패키지 추가</span>
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
          <div className="col-span-1">ID</div>
          <div className="col-span-2">이미지</div>
          <div className="col-span-3">패키지명</div>
          <div className="col-span-2">목적지</div>
          <div className="col-span-1">가격</div>
          <div className="col-span-1">카테고리</div>
          <div className="col-span-2 text-right">작업</div>
        </div>
        
        {packages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            등록된 패키지가 없습니다. 위의 버튼을 이용해 메인 사이트의 패키지를 가져오거나, 새 패키지를 추가해 주세요.
          </div>
        ) : (
          <div className="divide-y">
            {packages.map((pkg) => (
              <PackageItem key={pkg._id || pkg.id || crypto.randomUUID()} packageData={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
