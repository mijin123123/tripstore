import 'dotenv/config';
import { db } from './src/lib/neon';
import { packages } from './src/lib/schema';

async function checkPackages() {
  try {
    console.log('패키지 데이터 확인 중...');
    
    const allPackages = await db.select().from(packages);
    
    console.log('총 패키지 수:', allPackages.length);
    
    if (allPackages.length > 0) {
      console.log('\n패키지 목록:');
      allPackages.forEach((pkg, index) => {
        console.log(`${index + 1}. ID: ${pkg.id}`);
        console.log(`   제목: ${pkg.title}`);
        console.log(`   목적지: ${pkg.destination}`);
        console.log(`   가격: ${pkg.price}`);
        console.log('   ---');
      });
    } else {
      console.log('패키지 데이터가 없습니다.');
    }
    
  } catch (error) {
    console.error('패키지 데이터 확인 중 오류:', error);
  }
}

checkPackages();
