"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ReservationEditFormProps {
  id: string;
}

export default function ReservationEditForm({ id }: ReservationEditFormProps) {
  const router = useRouter();
  
  const [reservation, setReservation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    travelers: 1,
    status: 'pending',
    specialRequests: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        console.log('예약 데이터 조회 시작:', id);
        const response = await fetch(`/api/reservations/${id}`);
        
        console.log('응답 상태:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API 오류 응답:', errorText);
          throw new Error(`예약 데이터를 불러오는데 실패했습니다: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('응답 텍스트:', text);
        
        if (!text) {
          throw new Error('서버에서 빈 응답을 받았습니다');
        }
        
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('JSON 파싱 오류:', parseError);
          console.error('받은 텍스트:', text);
          throw new Error('서버 응답을 파싱할 수 없습니다');
        }
        
        console.log('파싱된 데이터:', data);
        setReservation(data);
        
        setFormData({
          contactName: data.contactName || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          travelers: data.travelers || 1,
          status: data.status || 'pending',
          specialRequests: data.specialRequests || '',
        });
      } catch (err) {
        console.error('예약 데이터 불러오기 오류:', err);
        setError(err instanceof Error ? err.message : '예약 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReservation();
  }, [id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = '예약 수정에 실패했습니다.';
        
        if (text) {
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = text;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      router.push(`/admin/reservations/${id}`);
      
    } catch (err) {
      console.error('예약 수정 오류:', err);
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!reservation) {
    return <div>예약 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            name="contactName"
            id="contactName"
            value={formData.contactName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            name="contactEmail"
            id="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">연락처</label>
          <input
            type="text"
            name="contactPhone"
            id="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="travelers" className="block text-sm font-medium text-gray-700">인원</label>
          <input
            type="number"
            name="travelers"
            id="travelers"
            value={formData.travelers}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">상태</label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="pending">대기</option>
            <option value="confirmed">확정</option>
            <option value="cancelled">취소</option>
          </select>
        </div>
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">특별 요청사항</label>
          <textarea
            name="specialRequests"
            id="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  );
}
