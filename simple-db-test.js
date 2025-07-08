// 간단한 DB 연결 테스트 스크립트
const { Pool } = require('pg');

// 환경 변수에서 URL 가져오기
const DATABASE_URL = process.env.NEON_DATABASE_URL;

console.log('데이터베이스 URL 확인:');
console.log('- URL 존재 여부:', !!DATABASE_URL);
// URL의 처음 몇 글자만 안전하게 표시
if (DATABASE_URL) {
  console.log('- URL 미리보기:', DATABASE_URL.substring(0, 30) + '...');
}

// URL에 작은따옴표가 있는지 확인
if (DATABASE_URL && DATABASE_URL.includes("'")) {
  console.log('⚠️ 경고: URL에 작은따옴표가 포함되어 있습니다. 이로 인해 연결 오류가 발생할 수 있습니다.');
}

// URL에 큰따옴표가 있는지 확인
if (DATABASE_URL && (DATABASE_URL.startsWith('"') || DATABASE_URL.endsWith('"'))) {
  console.log('⚠️ 경고: URL이 큰따옴표로 감싸져 있습니다. 이로 인해 연결 오류가 발생할 수 있습니다.');
  // 큰따옴표 제거
  const cleanUrl = DATABASE_URL.replace(/^"|"$/g, '');
  console.log('- 수정된 URL 미리보기:', cleanUrl.substring(0, 30) + '...');
  
  // 수정된 URL로 연결 시도
  console.log('\n수정된 URL로 연결 테스트 시도...');
  testConnection(cleanUrl);
} else {
  // 원래 URL로 연결 시도
  console.log('\n원본 URL로 연결 테스트 시도...');
  testConnection(DATABASE_URL);
}

// DB 연결 테스트 함수
async function testConnection(url) {
  if (!url) {
    console.error('오류: 데이터베이스 URL이 제공되지 않았습니다.');
    return;
  }
  
  const pool = new Pool({
    connectionString: url,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log('연결 시도 중...');
    const client = await pool.connect();
    console.log('✅ 연결 성공!');
    
    // 기본 쿼리 실행
    console.log('테이블 목록 조회 중...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log(`발견된 테이블: ${result.rows.length}개`);
    result.rows.forEach((row, i) => {
      console.log(`${i+1}. ${row.table_name}`);
    });
    
    // packages 테이블이 있는지 확인
    const packagesTable = result.rows.find(row => row.table_name === 'packages');
    if (packagesTable) {
      console.log('\n패키지 테이블 발견! 데이터 확인 중...');
      const packagesResult = await client.query('SELECT COUNT(*) FROM packages');
      console.log(`패키지 수: ${packagesResult.rows[0].count}`);
      
      if (parseInt(packagesResult.rows[0].count) > 0) {
        const samplesResult = await client.query('SELECT * FROM packages LIMIT 2');
        console.log('\n패키지 샘플:');
        samplesResult.rows.forEach((pkg, i) => {
          console.log(`[${i+1}번 패키지]`);
          console.log(`- ID: ${pkg.id}`);
          console.log(`- 제목: ${pkg.title}`);
          console.log(`- 가격: ${pkg.price}`);
        });
      }
    }
    
    client.release();
  } catch (err) {
    console.error('❌ 연결 실패:', err.message);
    console.error('오류 상세:', err);
  } finally {
    await pool.end();
    console.log('연결 종료');
  }
}
