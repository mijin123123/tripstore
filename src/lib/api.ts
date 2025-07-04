import { createClient } from '@/lib/supabase';
import { TravelPackage } from '@/data/packagesData';

/**
 * 모든 여행 패키지를 가져옵니다.
 */
export async function getAllPackages(): Promise<TravelPackage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('packages')
    .select('*');
  
  if (error) {
    console.error('패키지 데이터를 불러오는 중 오류가 발생했습니다:', error);
    return [];
  }
  
  return data || [];
}

/**
 * 관리자 페이지용 모든 패키지 데이터 조회
 */
export async function getPackages() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('패키지 데이터를 불러오는 중 오류가 발생했습니다:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('패키지 데이터를 불러오는 중 예외가 발생했습니다:', error);
    return [];
  }
}

/**
 * ID로 특정 여행 패키지를 가져옵니다.
 */
export async function getPackageById(id: string): Promise<TravelPackage | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`ID ${id}의 패키지를 불러오는 중 오류가 발생했습니다:`, error);
    return null;
  }
  
  return data;
}

/**
 * 추천 패키지 목록을 가져옵니다.
 */
export async function getFeaturedPackages(): Promise<TravelPackage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('isFeatured', true)
    .order('price', { ascending: true });
  
  if (error) {
    console.error('추천 패키지를 불러오는 중 오류가 발생했습니다:', error);
    return [];
  }
  
  return data || [];
}

/**
 * 특가 패키지 목록을 가져옵니다.
 */
export async function getSpecialOffers(): Promise<TravelPackage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('isOnSale', true)
    .order('discountPrice', { ascending: true });
  
  if (error) {
    console.error('특가 패키지를 불러오는 중 오류가 발생했습니다:', error);
    return [];
  }
  
  return data || [];
}

/**
 * 시즌별 패키지 목록을 가져옵니다.
 */
export async function getSeasonalPackages(season: string): Promise<TravelPackage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('season', season)
    .order('price', { ascending: true });
  
  if (error) {
    console.error(`${season} 시즌 패키지를 불러오는 중 오류가 발생했습니다:`, error);
    return [];
  }
  
  return data || [];
}

/**
 * 새 패키지를 추가합니다.
 */
export async function addPackage(packageData: Omit<TravelPackage, 'id'>): Promise<TravelPackage | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('packages')
    .insert([packageData])
    .select()
    .single();
  
  if (error) {
    console.error('패키지를 추가하는 중 오류가 발생했습니다:', error);
    return null;
  }
  
  return data;
}

/**
 * 패키지를 업데이트합니다.
 */
export async function updatePackage(id: string, packageData: Partial<TravelPackage>): Promise<TravelPackage | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('packages')
    .update(packageData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`ID ${id}의 패키지를 업데이트하는 중 오류가 발생했습니다:`, error);
    return null;
  }
  
  return data;
}

/**
 * 패키지를 삭제합니다.
 */
export async function deletePackage(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('packages')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`ID ${id}의 패키지를 삭제하는 중 오류가 발생했습니다:`, error);
    return false;
  }
  
  return true;
}
