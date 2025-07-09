const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function verifyMainPagePackages() {
  try {
    console.log('🔍 메인페이지 패키지 동기화 검증 시작...');
    
    if (!process.env.NEON_DATABASE_URL) {
      console.error('❌ NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
      return;
    }

    const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
    
    // 메인페이지에서 사용되는 패키지 제목들
    const mainPagePackageNames = [
      // featuredPackages
      '발리 럭셔리 빌라 휴양',
      '도쿄 문화 탐방', 
      '파리 로맨틱 투어',
      
      // specialOffers
      '제주 힐링 3일',
      '교토 단풍 특집',
      '다낭 골프 패키지',
      
      // seasonalPackages - 여름
      '몰디브 여름 에디션',
      '하와이 비치 패키지',
      
      // seasonalPackages - 가을  
      '유럽 가을 낭만',
      '한국의 가을',
      
      // seasonalPackages - 겨울
      '스위스 스키 여행',
      '일본 온천 여행'
    ];
    
    console.log(`📋 검증할 패키지 수: ${mainPagePackageNames.length}개\n`);
    
    let foundCount = 0;
    let missingPackages = [];
    
    // 각 패키지가 DB에 있는지 확인
    for (const packageName of mainPagePackageNames) {
      const result = await pool.query(
        'SELECT id, title, category, isfeatured, isonsale, price, discountprice FROM packages WHERE title = $1',
        [packageName]
      );
      
      if (result.rows.length > 0) {
        const pkg = result.rows[0];
        foundCount++;
        console.log(`✅ "${packageName}" 발견`);
        console.log(`   - ID: ${pkg.id}`);
        console.log(`   - 카테고리: ${pkg.category}`);
        console.log(`   - 추천여부: ${pkg.isfeatured ? '예' : '아니오'}`);
        console.log(`   - 할인여부: ${pkg.isonsale ? '예' : '아니오'}`);
        console.log(`   - 가격: ${pkg.price?.toLocaleString()}원`);
        if (pkg.discountprice) {
          console.log(`   - 할인가격: ${pkg.discountprice?.toLocaleString()}원`);
        }
        console.log('');
      } else {
        missingPackages.push(packageName);
        console.log(`❌ "${packageName}" 누락`);
      }
    }
    
    console.log('📊 동기화 검증 결과:');
    console.log(`✅ 발견된 패키지: ${foundCount}개`);
    console.log(`❌ 누락된 패키지: ${missingPackages.length}개`);
    
    if (missingPackages.length > 0) {
      console.log('\n❌ 누락된 패키지 목록:');
      missingPackages.forEach(name => console.log(`   - ${name}`));
    }
    
    // 카테고리별 분포 확인
    console.log('\n📈 카테고리별 패키지 분포:');
    const categoryCounts = await pool.query(`
      SELECT category, COUNT(*) as count 
      FROM packages 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    categoryCounts.rows.forEach(row => {
      console.log(`   - ${row.category}: ${row.count}개`);
    });
    
    // 추천/할인 패키지 분포
    console.log('\n🌟 특별 패키지 분포:');
    const specialCounts = await pool.query(`
      SELECT 
        SUM(CASE WHEN isfeatured = true THEN 1 ELSE 0 END) as featured_count,
        SUM(CASE WHEN isonsale = true THEN 1 ELSE 0 END) as sale_count,
        COUNT(*) as total_count
      FROM packages
    `);
    
    const counts = specialCounts.rows[0];
    console.log(`   - 추천 패키지: ${counts.featured_count}개`);
    console.log(`   - 할인 패키지: ${counts.sale_count}개`);
    console.log(`   - 전체 패키지: ${counts.total_count}개`);
    
    if (foundCount === mainPagePackageNames.length) {
      console.log('\n🎉 모든 메인페이지 패키지가 DB에 정상적으로 동기화되었습니다!');
    } else {
      console.log('\n⚠️  일부 패키지가 누락되어 있습니다. 확인이 필요합니다.');
    }
    
  } catch (error) {
    console.error('❌ 검증 중 오류:', error);
  }
}

verifyMainPagePackages();
