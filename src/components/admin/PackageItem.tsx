'use client';

import { useState } from 'react';
import { Pencil, Trash, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

// Package 타입 정의
interface Package {
  id: string;
  title: string;
  destination: string;
  price: string | number;
  category: string;
  images: string[];
  [key: string]: any; // 추가 필드 허용
}

interface PackageItemProps {
  packageData: Package;
}

export default function PackageItem({ packageData }: PackageItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  
  // 패키지 삭제 처리
  const handleDelete = async () => {
    if (confirm('이 패키지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setIsDeleting(true);
      
      try {
        const response = await fetch(`/api/packages/${packageData.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '패키지 삭제 실패');
        }
        
        alert('패키지가 삭제되었습니다.');
        // 페이지 새로고침
        router.refresh();
      } catch (error) {
        console.error('패키지 삭제 중 오류:', error);
        alert(error instanceof Error ? error.message : '패키지 삭제 중 오류가 발생했습니다.');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center">
      <div className="col-span-1 text-sm text-gray-500">
        {packageData.id.substring(0, 8)}...
      </div>
      
      <div className="col-span-2">
        {packageData.images && packageData.images.length > 0 ? (
          <div className="relative h-16 w-24 rounded overflow-hidden">
            <Image 
              src={packageData.images[0]} 
              alt={packageData.title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div className="h-16 w-24 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-xs text-gray-500">No image</span>
          </div>
        )}
      </div>
      
      <div className="col-span-3 font-medium">{packageData.title}</div>
      
      <div className="col-span-2 text-gray-600">{packageData.destination}</div>
      
      <div className="col-span-1">{formatCurrency(Number(packageData.price) || 0)}</div>
      
      <div className="col-span-1">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
          {packageData.category}
        </span>
      </div>
      
      <div className="col-span-2 flex justify-end gap-2">
        <Link href={`/packages/${packageData.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        
        <Link href={`/admin/packages/${packageData.id}/edit`}>
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
