import { createClient } from '@/lib/supabase';
import { Package, Villa, PackageTable, VillaTable } from '@/types';

// 모든 패키지 가져오기
export async function getAllPackages(): Promise<Package[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('packages')
    .select('*');
  
  if (error) {
    console.error('패키지를 가져오는 중 오류 발생:', error);
    return [];
  }
  
  return data as any;
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
  
  return data as any;
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
  
  return data as any;
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
