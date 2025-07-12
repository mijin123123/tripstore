import connectMongoDB from '@/lib/mongodb';
import Package from '@/models/Package';
import { TravelPackage } from '@/data/packagesData';

/**
 * 모든 여행 패키지를 가져옵니다.
 */
export async function getAllPackages(): Promise<TravelPackage[]> {
  try {
    await connectMongoDB();
    
    const packages = await Package.find({})
      .sort({ createdAt: -1 })
      .lean();
      
    return packages.map(pkg => ({
      ...pkg,
      id: pkg._id.toString()
    }));
  } catch (error) {
    console.error('패키지 데이터를 불러오는 중 오류가 발생했습니다:', error);
    return [];
  }
}

/**
 * 관리자 페이지용 모든 패키지 데이터 조회
 */
export async function getPackages() {
  try {
    await connectMongoDB();
    
    const packages = await Package.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    return {
      success: true,
      data: packages.map(pkg => ({
        ...pkg,
        id: pkg._id.toString()
      }))
    };
  } catch (error) {
    console.error('패키지 데이터를 불러오는 중 오류가 발생했습니다:', error);
    return { success: false, error: '패키지 데이터를 불러오는 데 실패했습니다.' };
  }
}

/**
 * ID로 특정 패키지 조회
 */
export async function getPackageById(id: string) {
  try {
    await connectMongoDB();
    
    const packageData = await Package.findById(id).lean();
    
    if (!packageData) {
      return { success: false, error: '해당 ID의 패키지를 찾을 수 없습니다.' };
    }
    
    return {
      success: true,
      data: {
        ...packageData,
        id: packageData._id.toString()
      }
    };
  } catch (error) {
    console.error(`ID ${id}의 패키지를 조회하는 중 오류가 발생했습니다:`, error);
    return { success: false, error: '패키지 데이터를 불러오는 데 실패했습니다.' };
  }
}

/**
 * 새 패키지 생성
 */
export async function createPackage(packageData: any) {
  try {
    await connectMongoDB();
    
    const newPackage = new Package(packageData);
    await newPackage.save();
    
    return {
      success: true,
      data: {
        ...newPackage.toObject(),
        id: newPackage._id.toString()
      }
    };
  } catch (error) {
    console.error('새 패키지를 생성하는 중 오류가 발생했습니다:', error);
    return { success: false, error: '패키지 생성에 실패했습니다.' };
  }
}

/**
 * 패키지 업데이트
 */
export async function updatePackage(id: string, packageData: any) {
  try {
    await connectMongoDB();
    
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { $set: { ...packageData, updated_at: new Date() } },
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedPackage) {
      return { success: false, error: '해당 ID의 패키지를 찾을 수 없습니다.' };
    }
    
    return {
      success: true,
      data: {
        ...updatedPackage,
        id: updatedPackage._id.toString()
      }
    };
  } catch (error) {
    console.error(`ID ${id}의 패키지를 업데이트하는 중 오류가 발생했습니다:`, error);
    return { success: false, error: '패키지 업데이트에 실패했습니다.' };
  }
}

/**
 * 패키지 삭제
 */
export async function deletePackage(id: string): Promise<boolean> {
  try {
    await connectMongoDB();
    
    const result = await Package.findByIdAndDelete(id);
    
    if (!result) {
      console.error(`ID ${id}의 패키지를 찾을 수 없습니다.`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`ID ${id}의 패키지를 삭제하는 중 오류가 발생했습니다:`, error);
    return false;
  }
}
