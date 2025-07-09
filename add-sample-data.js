require('dotenv').config({ path: '.env.local' });
const { Pool } = require('@neondatabase/serverless');

async function addSampleData() {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  
  try {
    console.log('샘플 데이터 추가 시작...');
    
    // 기존 데이터 확인
    const existingData = await pool.query('SELECT COUNT(*) as count FROM packages');
    console.log(`현재 패키지 수: ${existingData.rows[0].count}`);
    
    if (existingData.rows[0].count > 0) {
      console.log('이미 데이터가 있습니다. 샘플 데이터 추가를 생략합니다.');
      return;
    }
    
    // 샘플 데이터 추가
    const samplePackages = [
      {
        title: '나만의 수도 도쿄 여행',
        destination: '일본 도쿄',
        price: 1290000,
        duration: 5,
        category: '일본 여행',
        image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: '도쿄의 다양한 명소를 즐기는 특별한 여행'
      },
      {
        title: '서울 한옥마을 투어',
        destination: '한국 서울',
        price: 890000,
        duration: 3,
        category: '국내 관광',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: '전통 한옥마을에서 체험하는 한국의 아름다움'
      },
      {
        title: '부산 해운대 바다 여행',
        destination: '한국 부산',
        price: 650000,
        duration: 2,
        category: '국내 관광',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: '부산의 아름다운 바다와 맛있는 음식을 즐기는 여행'
      }
    ];
    
    for (const pkg of samplePackages) {
      await pool.query(`
        INSERT INTO packages (title, destination, price, duration, category, image_url, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [pkg.title, pkg.destination, pkg.price, pkg.duration, pkg.category, pkg.image_url, pkg.description]);
    }
    
    console.log('샘플 데이터 추가 완료!');
    
    // 추가된 데이터 확인
    const newData = await pool.query('SELECT COUNT(*) as count FROM packages');
    console.log(`추가 후 패키지 수: ${newData.rows[0].count}`);
    
  } catch (error) {
    console.error('샘플 데이터 추가 중 오류:', error);
  }
}

addSampleData();
