import { TravelPackage } from '@/data/packagesData';
import * as mongodbApi from './mongodb-api';

/**
 * 모든 여행 패키지를 가져옵니다.
 */
export async function getAllPackages(): Promise<TravelPackage[]> {
  return await mongodbApi.getAllPackages();
}

/**
 * 관리자 페이지용 모든 패키지 데이터 조회
 */
export async function getPackages() {
  return await mongodbApi.getPackages();
}

/**
 * ID로 특정 패키지를 조회합니다.
 */
export async function getPackageById(id: string) {
  return await mongodbApi.getPackageById(id);
}

/**
 * 새 패키지를 생성합니다.
 */
export async function createPackage(packageData: any) {
  return await mongodbApi.createPackage(packageData);
}

/**
 * 패키지를 업데이트합니다.
 */
export async function updatePackage(id: string, packageData: any) {
  return await mongodbApi.updatePackage(id, packageData);
}

/**
 * 패키지를 삭제합니다.
 */
export async function deletePackage(id: string): Promise<boolean> {
  return await mongodbApi.deletePackage(id);
}