// 파일에 로그를 저장하는 패키지 가져오기 스크립트
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');

// 로그 파일 설정
const logFile = path.join(__dirname, 'import-packages-log.txt');

// 로그 기록 함수
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

// 시작 로그
log('메인 사이트 패키지 데이터 가져오기 시작');
log('-------------------------------------');

// 메인 패키지 데이터 가져오기
async function importMainPackages() {
  try {
    log('패키지 데이터 모듈 로드 중...');
    const { packagesData } = require('./src/data/packagesData');
    
    log(`${packagesData.length}개의 메인 패키지 데이터를 발견했습니다.`);
    if (packagesData.length > 0) {
      log(`첫 번째 패키지: ${packagesData[0].name}, ${packagesData[0].destination}, ${packagesData[0].price}`);
    }
    
    // 데이터 변환
    log('패키지 데이터 변환 중...');
    const transformedPackages = packagesData.map(pkg => transformPackageData(pkg));
    log(`${transformedPackages.length}개의 패키지 데이터 변환 완료`);
    
    // DB 연결
    log('DB 연결 중...');
    const dbUrl = process.env.NEON_DATABASE_URL;
    if (!dbUrl) {
      log('오류: NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
      return;
    }
    
    const pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    const client = await pool.connect();
    log('✅ DB 연결 성공!');
    
    // 기존 패키지 확인
    const existingResult = await client.query('SELECT COUNT(*) FROM packages');
    const existingCount = parseInt(existingResult.rows[0].count);
    log(`기존 패키지 수: ${existingCount}`);
    
    if (existingCount > 0) {
      log('기존 패키지 삭제 중...');
      await client.query('DELETE FROM packages');
      log(`${existingCount}개의 기존 패키지 삭제 완료`);
    }
    
    // 새로운 패키지 삽입
    log('새로운 패키지 삽입 중...');
    let insertedCount = 0;
    
    for (const pkg of transformedPackages) {
      try {
        const result = await client.query(`
          INSERT INTO packages (
            id, title, description, destination, price, discountprice, 
            duration, departuredate, images, rating, reviewcount, 
            category, season, inclusions, exclusions, 
            isfeatured, isonsale, itinerary, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 
            $13, $14, $15, $16, $17, $18, $19, $20
          )
        `, [
          pkg.id, pkg.title, pkg.description, pkg.destination, 
          pkg.price, pkg.discountprice, pkg.duration, 
          pkg.departuredate, pkg.images, pkg.rating, pkg.reviewcount,
          pkg.category, pkg.season, pkg.inclusions, pkg.exclusions,
          pkg.isfeatured, pkg.isonsale, pkg.itinerary, 
          pkg.created_at, pkg.updated_at
        ]);
        
        insertedCount++;
      } catch (insertError) {
        log(`패키지 삽입 실패: ${insertError.message}`);
      }
    }
    
    log(`${insertedCount}개의 패키지를 성공적으로 삽입했습니다.`);
    
    // 삽입 확인
    const finalResult = await client.query('SELECT COUNT(*) FROM packages');
    log(`최종 패키지 수: ${finalResult.rows[0].count}`);
    
    client.release();
    await pool.end();
    log('DB 연결 종료');
    
  } catch (error) {
    log(`오류 발생: ${error.message}`);
    log(error.stack);
  }
}

// 패키지 데이터를 변환하는 함수
const transformPackageData = (pkg) => {
  // 가격 문자열에서 숫자만 추출 (예: "1,800,000원" -> 1800000)
  const price = parseFloat(pkg.price.replace(/[^0-9]/g, ''));
  const discountPrice = price * 0.9; // 10% 할인가 (예시)
  
  // 여행 기간에서 숫자만 추출 (예: "5박 6일" -> 5)
  const durationMatch = pkg.duration?.match(/(\d+)박/);
  const duration = durationMatch ? parseInt(durationMatch[1]) : 3;
  
  // 카테고리 매핑
  const category = pkg.type === '커플' ? '로맨틱여행' : 
                  pkg.type === '어드벤처' ? '모험여행' : '국내여행';
  
  // 계절 추출 (출발일 기반)
  const getSeasonFromDate = (date) => {
    const month = parseInt(date.split('.')[1]);
    if (month >= 3 && month <= 5) return '봄';
    if (month >= 6 && month <= 8) return '여름';
    if (month >= 9 && month <= 11) return '가을';
    return '겨울';
  };
  
  const season = pkg.departureDate && pkg.departureDate.length > 0 
    ? getSeasonFromDate(pkg.departureDate[0]) 
    : '여름';
  
  // 이미지 URL 배열
  const images = pkg.gallery || [pkg.image];
  
  // 포함/불포함 항목
  const inclusions = pkg.includes || [];
  const exclusions = pkg.excludes || [];
  
  // 일정을 itinerary 객체로 변환
  const itinerary = pkg.itinerary 
    ? { 
        days: pkg.itinerary.map(item => ({
          title: item.title,
          description: item.description,
          image: item.image
        })) 
      }
    : null;
  
  // itinerary를 JSON 문자열로 직렬화 (jsonb 타입 호환)
  const itineraryForDB = itinerary ? JSON.stringify(itinerary) : null;

  // uuid 생성
  const uuid = require('uuid').v4();

  return {
    id: uuid,
    title: pkg.name,
    description: pkg.description,
    destination: pkg.destination,
    price: price.toString(), // decimal 타입에 맞게 문자열로 저장
    discountprice: discountPrice.toString(), // decimal 타입에 맞게 문자열로 저장
    duration: duration,
    departuredate: pkg.departureDate || [],
    images: images,
    rating: pkg.rating?.toString() || '4.5', // decimal 타입에 맞게 문자열로 저장
    reviewcount: Math.floor(Math.random() * 20) + 5,
    category: category,
    season: season,
    inclusions: inclusions,
    exclusions: exclusions,
    isfeatured: Math.random() > 0.5,
    isonsale: Math.random() > 0.7,
    itinerary: itineraryForDB, // JSON 문자열로 저장
    created_at: new Date(),
    updated_at: new Date(),
  };
};

// 실행
importMainPackages().then(() => {
  log('스크립트 실행 완료');
});
