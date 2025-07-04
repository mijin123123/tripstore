'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NoticeFormProps {
  id?: string;
  initialData?: {
    title: string;
    content: string;
    is_important: boolean;
  };
}

export default function NoticeForm({ id, initialData }: NoticeFormProps) {
  const router = useRouter();
  const isEditing = !!id || !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    is_important: initialData?.is_important || false,
  });

  const [isLoading, setIsLoading] = useState(isEditing && !initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && !initialData) {
      const fetchNotice = async () => {
        try {
          const response = await fetch(`/api/notices/${id}`);
          if (!response.ok) {
            throw new Error('공지사항 데이터를 불러오는데 실패했습니다.');
          }
          const data = await response.json();
          setFormData({
            title: data.title || '',
            content: data.content || '',
            is_important: data.is_important || false,
          });
        } catch (err) {
          console.error('공지사항 데이터 조회 오류:', err);
          setError('데이터를 불러올 수 없습니다.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchNotice();
    }
  }, [id, isEditing, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/notices${isEditing ? `/${id}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('공지사항 저장 중 오류가 발생했습니다.');
      }

      router.push('/admin/notices');
      router.refresh();
    } catch (err: any) {
      console.error('공지사항 저장 오류:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? '공지사항 수정' : '새 공지사항 작성'}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">제목 *</label>
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
              <label className="text-sm font-medium">내용 *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_important"
                id="is_important"
                checked={formData.is_important}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_important" className="text-sm font-medium">중요 공지</label>
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
              {isSubmitting ? '저장 중...' : (isEditing ? '수정하기' : '작성하기')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
