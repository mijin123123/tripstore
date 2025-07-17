"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Check, X } from 'lucide-react';

// generateStaticParams는 별도 파일로 이동했습니다

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 엔드포인트로부터 예약 정보 가져오기
        const response = await fetch(`/api/reservations/${id}`);
        
        if (!response.ok) {
          throw new Error('예약 데이터를 불러올 수 없습니다.');
        }
        
        const data = await response.json();
        setReservation(data);
      } catch (err: any) {
        console.error('예약 데이터 조회 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  if (loading) {
    return <div>로딩 중...</div>;
  }
  
  if (error || !reservation) {
    return <div>예약 정보를 불러올 수 없습니다.</div>;
  }
  
  // 숫자를 통화 형식으로 포맷팅
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { 
      style: 'currency', 
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // 예약 상태에 따른 배지 스타일
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center">
            <Check className="w-4 h-4 mr-1" />
            확정
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 flex items-center">
            <X className="w-4 h-4 mr-1" />
            취소됨
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 flex items-center">
            <Check className="w-4 h-4 mr-1" />
            완료
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            대기중
          </span>
        );
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/reservations">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              예약 목록으로
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">예약 상세</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {getStatusBadge(reservation.status)}
          
          <Link href={`/admin/reservations/${id}/edit`}>
            <Button>예약 수정</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>예약 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">예약 ID</p>
                  <p>{reservation.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">예약 상태</p>
                  <p>{getStatusBadge(reservation.status)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">예약 일자</p>
                  <p>{new Date(reservation.created_at).toLocaleDateString('ko-KR')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">출발 일자</p>
                  <p>{reservation.departure_date}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">인원</p>
                  <p>{reservation.travelers}명</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">총 금액</p>
                  <p className="font-bold">{formatCurrency(reservation.total_price)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">결제 상태</p>
                  <p>{reservation.payment_status === 'paid' ? '결제 완료' : '미결제'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>고객 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">이름</p>
                  <p>{reservation.contact_name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">이메일</p>
                  <p>{reservation.contact_email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">전화번호</p>
                  <p>{reservation.contact_phone}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">특별 요청</p>
                  <p>{reservation.special_requests || '없음'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>패키지 정보</CardTitle>
            </CardHeader>
            <CardContent>
              {reservation.packages ? (
                <div className="space-y-4">
                  {reservation.packages.images && reservation.packages.images[0] && (
                    <div className="aspect-video rounded-md overflow-hidden bg-gray-100">
                      <img 
                        src={reservation.packages.images[0]} 
                        alt={reservation.packages.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <h3 className="font-bold text-lg">{reservation.packages.title}</h3>
                  <p className="text-gray-600">{reservation.packages.destination}</p>
                  
                  <Link href={`/admin/packages/${reservation.package_id}`}>
                    <Button variant="outline" className="w-full">
                      패키지 상세 보기
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500">패키지 정보를 찾을 수 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
