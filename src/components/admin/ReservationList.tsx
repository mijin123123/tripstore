'use client';

import { useState } from 'react';
import { Pencil, XCircle, CheckCircle, MoreHorizontal, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

// 예약 상태 타입
type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// 예약 타입 정의
interface Reservation {
  id: string;
  userId: string | null;
  packageId: string | null;
  departureDate: string;
  travelers: number;
  totalPrice: string;
  status: ReservationStatus;
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

interface ReservationListProps {
  reservations: Reservation[];
  onStatusChange: () => void;
}

export default function ReservationList({ reservations, onStatusChange }: ReservationListProps) {
  
  // 숫자를 통화 형식으로 포맷팅
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { 
      style: 'currency', 
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // 예약 상태에 따른 배지 스타일
  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            확정
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            취소됨
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            완료
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            대기중
          </span>
        );
    }
  };
  
  // 예약 상태 변경 처리
  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    if (confirm(`예약 상태를 "${newStatus === 'confirmed' ? '확정' : newStatus === 'cancelled' ? '취소' : newStatus === 'completed' ? '완료' : '대기중'}"으로 변경하시겠습니까?`)) {
      try {
        const response = await fetch(`/api/reservations/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '예약 상태 변경 실패');
        }
        
        alert('예약 상태가 변경되었습니다.');
        onStatusChange(); // 상태 변경 후 부모 컴포넌트에 알림
      } catch (error) {
        console.error('예약 상태 변경 중 오류:', error);
        alert(error instanceof Error ? error.message : '예약 상태 변경 중 오류가 발생했습니다.');
      }
    }
  };
  
  return (
    <div className="divide-y">
      {reservations.map((reservation) => (
        <div key={reservation.id} className="grid grid-cols-12 gap-4 p-4 items-center">
          <div className="col-span-2 text-sm text-gray-500">
            {reservation.id.substring(0, 8)}...
          </div>
          
          <div className="col-span-3 font-medium">
            {reservation.packageTitle || '패키지 정보 없음'}
          </div>
          
          <div className="col-span-2">
            <div>{reservation.contactName}</div>
            <div className="text-xs text-gray-500">{reservation.contactEmail}</div>
          </div>
          
          <div className="col-span-1">{reservation.travelers}명</div>
          
          <div className="col-span-1">{formatCurrency(parseInt(reservation.totalPrice))}</div>
          
          <div className="col-span-1">
            {getStatusBadge(reservation.status)}
          </div>
          
          <div className="col-span-2 flex justify-end gap-2">
            <Link href={`/admin/reservations/${reservation.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link href={`/admin/reservations/${reservation.id}/edit`}>
              <Button variant="ghost" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            
            {reservation.status === 'pending' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleStatusChange(reservation.id, 'confirmed')}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
              </Button>
            )}
            
            {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleStatusChange(reservation.id, 'cancelled')}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
