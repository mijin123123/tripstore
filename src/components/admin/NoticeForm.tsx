'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NoticeFormProps {
  initialData?: {
    id?: string;
    title?: string;
    content?: string;
    is_important?: boolean;
  } | null;
}

export default function NoticeForm({ initialData = null }: NoticeFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    is_important: initialData?.is_important || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      // API 요청 (실제 API 구현 필요)
      const response = await fetch(`/api/notices${isEditing ? `/${initialData.id}` : ''}`, {
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
                id="is_important"
                name="is_important"
                checked={formData.is_important}
                onChange={handleChange as any}
                className="h-4 w-4"
              />
              <label htmlFor="is_important" className="text-sm font-medium">
                중요 공지사항으로 표시
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
              {isSubmitting ? '저장 중...' : isEditing ? '수정하기' : '작성하기'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
