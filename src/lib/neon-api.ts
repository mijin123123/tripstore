import { Pool } from '@neondatabase/serverless';
import { TravelPackage } from '@/data/packagesData';

/**
 * 네온DB에서 모든 여행 패키지를 가져옵니다.
 */
export async function getAllPackagesFromNeon(): Promise<TravelPackage[]> {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  
  try {
    console.log('네온DB에서 패키지 데이터 조회 시도...');
    const result = await pool.query('SELECT * FROM packages ORDER BY created_at DESC');
    
    // 데이터베이스 스키마를 TravelPackage 형식으로 변환
    const convertedPackages: TravelPackage[] = result.rows.map((pkg, index) => ({
      id: index + 1, // TravelPackage는 number id를 요구하므로 임시로 인덱스 사용
      name: pkg.title || pkg.destination,
      destination: pkg.destination,
      description: pkg.description,
      price: pkg.price ? `${pkg.price}원` : '가격 문의',
      image: pkg.images && Array.isArray(pkg.images) && pkg.images.length > 0 
        ? pkg.images[0] 
        : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070',
      type: pkg.category || '기타',
      rating: pkg.rating ? Number(pkg.rating) : undefined,
      duration: pkg.duration || undefined,
      departureDate: pkg.departure_date && Array.isArray(pkg.departure_date) 
        ? pkg.departure_date 
        : undefined
    }));
    
    console.log(`네온DB에서 ${convertedPackages.length}개의 패키지 조회 성공`);
    return convertedPackages;
  } catch (error) {
    console.error('네온DB 조회 오류:', error);
    return [];
  } finally {
    await pool.end();
  }
}

/**
 * 네온DB에 패키지 데이터를 삽입합니다.
 */
export async function insertPackageToNeon(packageData: any) {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  
  try {
    const query = `
      INSERT INTO packages (title, destination, description, price, discount_price, duration, category, season, rating, review_count, images, departure_date, inclusions, exclusions, itinerary, is_featured, is_on_sale)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    
    const values = [
      packageData.title,
      packageData.destination,
      packageData.description,
      packageData.price,
      packageData.discountPrice || null,
      packageData.duration,
      packageData.category,
      packageData.season,
      packageData.rating || null,
      packageData.reviewCount || null,
      JSON.stringify(packageData.images || []),
      JSON.stringify(packageData.departureDate || []),
      JSON.stringify(packageData.inclusions || []),
      JSON.stringify(packageData.exclusions || []),
      JSON.stringify(packageData.itinerary || {}),
      packageData.isFeatured || false,
      packageData.isOnSale || false
    ];
    
    const result = await pool.query(query, values);
    console.log('네온DB에 패키지 삽입 성공:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('네온DB 삽입 오류:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

/**
 * 네온DB 연결 상태를 테스트합니다.
 */
export async function testNeonConnection() {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  
  try {
    console.log('네온DB 연결 테스트 시작...');
    const result = await pool.query('SELECT COUNT(*) as package_count FROM packages');
    console.log(`네온DB 연결 성공! 현재 ${result.rows[0].package_count}개의 패키지가 있습니다.`);
    return true;
  } catch (error) {
    console.error('네온DB 연결 실패:', error);
    return false;
  } finally {
    await pool.end();
  }
}
