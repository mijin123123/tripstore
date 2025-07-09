"use client";

import { useState, useEffect } from "react";
import AdminProtection from '@/components/AdminProtection';
import AdminLogout from '@/components/AdminLogout';
import ReservationList from '@/components/admin/ReservationList';

interface ReservationData {
  id: string;
  packages: {
    title: string;
  };
  [key: string]: any;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReservations() {
      try {
        // 예약 데이터는 별도 API 엔드포인트가 필요할 수 있습니다
        // 우선 빈 배열로 설정하고 나중에 API 엔드포인트를 추가할 수 있습니다
        setReservations([]);
      } catch (err) {
        console.error('예약 데이터 조회 오류:', err);
        setError('예약 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  if (loading) {
    return <div className="p-6">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  
  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">예약 관리</h1>
            <AdminLogout />
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
              <div className="col-span-2">예약 ID</div>
              <div className="col-span-3">패키지</div>
              <div className="col-span-2">고객 정보</div>
              <div className="col-span-1">인원</div>
              <div className="col-span-1">금액</div>
              <div className="col-span-1">상태</div>
              <div className="col-span-2 text-right">작업</div>
            </div>
            
            {reservations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                예약 정보가 없습니다.
              </div>
            ) : (
              <div className="p-4">
                <p className="text-gray-500">예약 목록 구현 예정</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}
