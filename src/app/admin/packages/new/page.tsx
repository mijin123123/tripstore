import PackageForm from '@/components/admin/PackageForm';

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">새 패키지 추가</h1>
      <PackageForm />
    </div>
  );
}
