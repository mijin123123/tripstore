"use client";

import { useState, useEffect } from "react";
import ReservationList from '@/components/admin/ReservationList';

interface ReservationData {
  id: string;
  userId: string | null;
  packageId: string | null;
  departureDate: string;
  travelers: number;
  totalPrice: string;
  status: string;
  paymentStatus: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  packageTitle: string | null;
  packageDestination: string | null;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reservations');
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        throw new Error('Failed to fetch reservations');
      }
    } catch (err) {
      console.error('예약 데이터 조회 오류:', err);
      setError('예약 데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = () => {
    fetchReservations(); // 상태 변경 후 데이터 다시 로드
  };

  if (loading) {
    return <div className="p-6">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">예약 관리</h1>
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
          <ReservationList reservations={reservations} onStatusChange={handleStatusChange} />
        )}
      </div>
    </div>
  );
}
