import { TravelPackage } from '@/data/packagesData';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * 모든 여행 패키지를 가져옵니다.
 */
export async function getAllPackages(): Promise<TravelPackage[]> {
  try {
    const { data: packages, error } = await supabaseAdmin
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('패키지 조회 오류:', error);
      return [];
    }

    return packages.map((pkg: any) => ({
      id: pkg.id,
      name: pkg.title,
      destination: pkg.location || pkg.title,
      type: pkg.category || "해외여행",
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      duration: `${pkg.duration || 7}일`,
      image: pkg.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1740",
      rating: 4.5,
      reviews: 128
    }));
  } catch (error) {
    console.error('getAllPackages 오류:', error);
    return [];
  }
}

/**
 * 관리자 페이지용 모든 패키지 데이터 조회
 */
export async function getPackages() {
  try {
    const { data: packages, error } = await supabaseAdmin
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('관리자 패키지 조회 오류:', error);
      return { success: false, packages: [] };
    }

    return { success: true, packages };
  } catch (error) {
    console.error('getPackages 오류:', error);
    return { success: false, packages: [] };
  }
}

/**
 * ID로 특정 패키지를 조회합니다.
 */
export async function getPackageById(id: string) {
  try {
    const { data: pkg, error } = await supabaseAdmin
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('패키지 조회 오류:', error);
      return null;
    }

    return pkg;
  } catch (error) {
    console.error('getPackageById 오류:', error);
    return null;
  }
}

/**
 * 새 패키지를 생성합니다.
 */
export async function createPackage(packageData: any) {
  try {
    const { data: pkg, error } = await supabaseAdmin
      .from('packages')
      .insert({
        title: packageData.title,
        description: packageData.description,
        price: packageData.price,
        duration: packageData.duration,
        location: packageData.location,
        image_url: packageData.image_url,
        category: packageData.category
      })
      .select()
      .single();

    if (error) {
      console.error('패키지 생성 오류:', error);
      return { success: false, error: error.message };
    }

    return { success: true, package: pkg };
  } catch (error) {
    console.error('createPackage 오류:', error);
    return { success: false, error: '패키지 생성 중 오류가 발생했습니다.' };
  }
}

/**
 * 패키지를 업데이트합니다.
 */
export async function updatePackage(id: string, packageData: any) {
  try {
    const { data: pkg, error } = await supabaseAdmin
      .from('packages')
      .update({
        title: packageData.title,
        description: packageData.description,
        price: packageData.price,
        duration: packageData.duration,
        location: packageData.location,
        image_url: packageData.image_url,
        category: packageData.category,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('패키지 업데이트 오류:', error);
      return { success: false, error: error.message };
    }

    return { success: true, package: pkg };
  } catch (error) {
    console.error('updatePackage 오류:', error);
    return { success: false, error: '패키지 업데이트 중 오류가 발생했습니다.' };
  }
}

/**
 * 패키지를 삭제합니다.
 */
export async function deletePackage(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('packages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('패키지 삭제 오류:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('deletePackage 오류:', error);
    return false;
  }
}