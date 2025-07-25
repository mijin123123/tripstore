// API에서는 supabase.ts만 사용하여 일관성 유지
import { createClient } from '@/lib/supabase';
import { Package, Villa, PackageTable, VillaTable } from '@/types';

// 모든 패키지 가져오기
export async function getAllPackages(): Promise<Package[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*');
    
    if (error) {
      console.error('패키지를 가져오는 중 오류 발생:', error);
      return [];
    }
    
    // 데이터베이스 스키마와 UI 간의 필드 매핑
    const mappedData = data?.map((pkg: any) => ({
      ...pkg,
      // 데이터베이스의 실제 필드 구조 사용
      title: pkg.title || pkg.name, // title 필드가 있으면 사용, 없으면 name 사용
      regionKo: pkg.region_ko || pkg.region, // region_ko 필드가 있으면 사용, 없으면 region 사용
      name: pkg.title || pkg.name, // UI 호환성을 위해 name도 추가
      category: pkg.type || pkg.category, // type 필드를 category로 매핑
    })) || [];
    
    return mappedData as Package[];
  } catch (err) {
    console.error('API 호출 중 예외 발생:', err);
    return [];
  }
}

// 특정 타입과 지역의 패키지 가져오기
export async function getPackagesByTypeAndRegion(type: string, region: string): Promise<Package[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('type', type)
    .eq('region', region);
  
  if (error) {
    console.error('패키지를 가져오는 중 오류 발생:', error);
    return [];
  }
  
  // 데이터베이스 스키마와 UI 간의 필드 매핑
  const mappedData = data?.map((pkg: any) => ({
    ...pkg,
    title: pkg.title || pkg.name,
    regionKo: pkg.region_ko || pkg.region,
    name: pkg.title || pkg.name,
    category: pkg.type || pkg.category,
  })) || [];
  
  return mappedData as Package[];
}

// ID로 패키지 가져오기
export async function getPackageById(id: string): Promise<Package | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('패키지를 가져오는 중 오류 발생:', error);
    return null;
  }
  
  if (!data) {
    return null;
  }
  
  // 데이터베이스 스키마와 UI 간의 필드 매핑
  const mappedData = {
    ...data,
    title: (data as any).title || data.name,
    regionKo: (data as any).region_ko || data.region,
    category: (data as any).type || data.category,
  };
  
  return mappedData as Package;
}

// 모든 빌라 가져오기
export async function getAllVillas(): Promise<Villa[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('villas')
    .select('*');
  
  if (error) {
    console.error('빌라를 가져오는 중 오류 발생:', error);
    return [];
  }
  
  return data as Villa[];
}

// ID로 빌라 가져오기
export async function getVillaById(id: string): Promise<Villa | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('villas')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('빌라를 가져오는 중 오류 발생:', error);
    return null;
  }
  
  return data as Villa;
}

// 새 패키지 추가
export async function createPackage(packageData: Omit<PackageTable, 'id'>): Promise<Package | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('packages')
    .insert([packageData as any])
    .select();
  
  if (error) {
    console.error('패키지를 추가하는 중 오류 발생:', error);
    return null;
  }
  
  return data[0] as any;
}

// 패키지 업데이트
export async function updatePackage(id: string, packageData: Partial<PackageTable>): Promise<Package | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('packages')
    .update(packageData as any)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('패키지를 업데이트하는 중 오류 발생:', error);
    return null;
  }
  
  return data[0] as any;
}

// 패키지 삭제
export async function deletePackage(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('packages')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('패키지를 삭제하는 중 오류 발생:', error);
    return false;
  }
  
  return true;
}
