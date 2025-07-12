'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, PackageX, Map } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/utils/formatPrice';

// 패키지 타입 정의
interface Package {
  id: string;
  destination: string;
  type: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  rating: number;
  reviews: number;
}

export default function PackagesClient({ initialPackages }: { initialPackages: Package[] }) {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 컴포넌트 마운트 시 API에서 최신 패키지 데이터 가져오기
  useEffect(() => {
    async function fetchPackages() {
      try {
        setLoading(true);
        setError(null);
        
        // API에서 패키지 데이터 가져오기
        const response = await fetch('/api/packages', { 
          cache: 'no-store',
          headers: { 'x-client-fetch': 'true' }
        });
        
        if (!response.ok) {
          throw new Error(`API 응답 오류: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 데이터 형식 검증
        if (Array.isArray(data) && data.length > 0) {
          // API 응답 데이터 포맷팅
          const formattedPackages = data.map((pkg: any) => ({
            id: pkg.id || pkg._id?.toString() || '',
            destination: pkg.destination || pkg.title || '',
            type: pkg.category || "해외여행",
            title: pkg.title || '',
            description: pkg.description || '',
            price: pkg.price || 0,
            duration: `${pkg.duration || 7}일`,
            image: pkg.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1740",
            rating: 4.5,
            reviews: 128
          }));
          
          console.log(`✅ 클라이언트에서 ${formattedPackages.length}개 패키지 로드됨`);
          setPackages(formattedPackages);
        } else {
          // 빈 배열이나 올바르지 않은 형식인 경우 초기 패키지 유지
          console.log('⚠️ API가 유효한 데이터를 반환하지 않음, 초기 데이터 유지');
        }
      } catch (err) {
        console.error('🚨 패키지 데이터 로딩 오류:', err);
        setError('패키지 데이터를 불러오는 데 문제가 발생했습니다');
        // 오류 발생해도 초기 패키지는 유지됨
      } finally {
        setLoading(false);
      }
    }
    
    // 이미 초기 데이터가 충분히 있다면 추가 요청을 건너뜀
    if (initialPackages.length > 10) {
      console.log('✅ 이미 충분한 초기 데이터가 있습니다');
      return;
    }
    
    fetchPackages();
  }, [initialPackages]);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            여행 패키지
          </h2>
          <p className="text-gray-600 mt-1">
            총 {packages.length}개의 패키지
            {loading && <span className="ml-2 text-blue-500 text-sm animate-pulse">로딩 중...</span>}
          </p>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-16">
          <PackageX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            {loading ? '패키지를 불러오는 중...' : '검색 결과가 없습니다'}
          </h3>
          <p className="text-gray-400">
            {loading ? '잠시만 기다려 주세요' : '다른 검색어나 필터를 사용해 보세요'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/packages/${pkg.id}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    {pkg.type}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {pkg.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {pkg.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Map className="w-4 h-4" />
                    <span>{pkg.destination}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {formatPrice(pkg.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {pkg.duration}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
