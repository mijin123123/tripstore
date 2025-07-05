'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PackageForm({ initialData = null }) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    destination: initialData?.destination || '',
    price: initialData?.price || '',
    duration: initialData?.duration || '',
    category: initialData?.category || '',
    images: initialData?.images?.[0] || '',
    departuredate: initialData?.departuredate?.join(', ') || '',
    inclusions: initialData?.inclusions?.join('\n') || '',
    exclusions: initialData?.exclusions?.join('\n') || '',
    isfeatured: initialData?.isfeatured || false,
    isonsale: initialData?.isonsale || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      console.log('📝 패키지 폼 제출 시작');
      console.log('🔍 isEditing:', isEditing);
      console.log('🆔 initialData.id:', initialData?.id);
      
      // 데이터 형식 변환
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        departuredate: formData.departuredate.split(',').map(date => date.trim()),
        inclusions: formData.inclusions.split('\n').filter(item => item.trim()),
        exclusions: formData.exclusions.split('\n').filter(item => item.trim()),
        images: [formData.images],
      };

      console.log('📦 변환된 패키지 데이터:', packageData);

      const url = `/api/packages${isEditing ? `/${initialData.id}` : ''}`;
      const method = isEditing ? 'PUT' : 'POST';
      
      console.log('🌐 API 요청:', method, url);

      // API 요청
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });

      console.log('📡 API 응답 상태:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API 오류 응답:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ API 성공 응답:', result);

      router.push('/admin/packages');
      router.refresh();
    } catch (err) {
      console.error('💥 패키지 저장 오류:', err);
      setError(err.message || '패키지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? '패키지 수정' : '새 패키지 추가'}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">패키지명 *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">목적지 *</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">가격 (₩) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">기간 (일) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">카테고리 *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="">카테고리 선택</option>
                <option value="인기 여행지">인기 여행지</option>
                <option value="유럽">유럽</option>
                <option value="아시아">아시아</option>
                <option value="미주">미주</option>
                <option value="오세아니아">오세아니아</option>
                <option value="아프리카">아프리카</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">이미지 URL *</label>
              <input
                type="url"
                name="images"
                value={formData.images}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">출발 날짜 (쉼표로 구분) *</label>
              <input
                type="text"
                name="departuredate"
                value={formData.departuredate}
                onChange={handleChange}
                required
                placeholder="YYYY-MM-DD, YYYY-MM-DD, ..."
                className="w-full p-2 border rounded-md"
              />
              <p className="text-xs text-gray-500">예: 2025-07-15, 2025-07-29, 2025-08-12</p>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">설명 *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">포함 사항 (각 항목을 새 줄에 입력)</label>
              <textarea
                name="inclusions"
                value={formData.inclusions}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">불포함 사항 (각 항목을 새 줄에 입력)</label>
              <textarea
                name="exclusions"
                value={formData.exclusions}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isfeatured"
                name="isfeatured"
                checked={formData.isfeatured}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label htmlFor="isfeatured" className="text-sm font-medium">
                추천 상품으로 표시
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isonsale"
                name="isonsale"
                checked={formData.isonsale}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label htmlFor="isonsale" className="text-sm font-medium">
                할인 상품으로 표시
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              취소
            </Button>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : isEditing ? '수정하기' : '추가하기'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
