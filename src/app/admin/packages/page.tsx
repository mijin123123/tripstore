import { getPackages } from "@/lib/api";
import PackageItem from "@/components/admin/PackageItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function PackagesPage() {
  const packages = await getPackages();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">패키지 관리</h1>
        
        <Link href="/admin/packages/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>새 패키지 추가</span>
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
          <div className="col-span-1">ID</div>
          <div className="col-span-2">이미지</div>
          <div className="col-span-3">패키지명</div>
          <div className="col-span-2">목적지</div>
          <div className="col-span-1">가격</div>
          <div className="col-span-1">카테고리</div>
          <div className="col-span-2 text-right">작업</div>
        </div>
        
        <div className="divide-y">
          {packages.map((pkg) => (
            <PackageItem key={pkg.id} packageData={pkg} />
          ))}
        </div>
      </div>
    </div>
  );
}
