"use client";

import NoticeForm from '@/components/admin/NoticeForm';

export default function NewNoticePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">새 공지사항 작성</h1>
      <NoticeForm />
    </div>
  );
}
