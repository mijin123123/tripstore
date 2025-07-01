import PackageForm from '@/components/admin/PackageForm';
import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface PackageEditPageProps {
  params: {
    id: string;
  };
}

export default async function PackageEditPage({ params }: PackageEditPageProps) {
  const { id } = params;
  
  // 패키지 데이터 조회
  const supabase = createClient();
  const { data: packageData, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !packageData) {
    console.error('패키지 데이터 조회 오류:', error);
    notFound();
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">패키지 수정</h1>
      <PackageForm initialData={packageData} />
    </div>
  );
}
