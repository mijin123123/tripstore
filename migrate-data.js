import { db } from './src/lib/neon.ts';
import { packages } from './src/lib/schema.ts';
import { packagesData } from './src/data/packagesData.ts';

async function migratePackageData() {
  try {
    console.log('Starting package data migration...');
    
    // 기존 패키지 데이터 확인
    const existingPackages = await db.select().from(packages);
    console.log(`Found ${existingPackages.length} existing packages`);
    
    if (existingPackages.length > 0) {
      console.log('Database already has package data. Skipping migration.');
      return;
    }
    
    // 정적 데이터를 데이터베이스 형식으로 변환
    const transformedData = packagesData.map(pkg => ({
      title: pkg.name,
      description: pkg.description,
      destination: pkg.destination,
      price: pkg.price.replace(/[^\d]/g, ''), // 숫자만 추출
      discountprice: null,
      duration: pkg.duration ? parseInt(pkg.duration) : 7,
      departuredate: pkg.departureDate || ['2025-08-01', '2025-08-15', '2025-09-01'],
      images: [pkg.image],
      rating: pkg.rating ? pkg.rating.toString() : '4.5',
      reviewcount: Math.floor(Math.random() * 100) + 10,
      category: pkg.type,
      season: '연중',
      inclusions: pkg.includes || [],
      exclusions: pkg.excludes || [],
      isfeatured: Math.random() > 0.5,
      isonsale: Math.random() > 0.7,
      itinerary: pkg.itinerary || null,
    }));
    
    // 데이터베이스에 삽입
    const insertedPackages = await db.insert(packages).values(transformedData).returning();
    console.log(`Successfully migrated ${insertedPackages.length} packages`);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migratePackageData();
