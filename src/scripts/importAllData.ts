import { importPackages } from './importPackages';
import { importNotices } from './importNotices';
import { importReservations } from './importReservations';

async function importAllData() {
  try {
    console.log('모든 데이터 가져오기 시작...');
    
    // 패키지 가져오기
    console.log('\n===== 패키지 데이터 가져오기 =====');
    await importPackages();
    
    // 공지사항 가져오기
    console.log('\n===== 공지사항 데이터 가져오기 =====');
    await importNotices();
    
    // 예약 가져오기
    console.log('\n===== 예약 데이터 가져오기 =====');
    await importReservations();
    
    console.log('\n모든 데이터 가져오기가 완료되었습니다!');
  } catch (error) {
    console.error('데이터 가져오기 중 오류 발생:', error);
  }
}

importAllData()
  .then(() => {
    console.log('프로세스 종료');
    process.exit(0);
  })
  .catch(error => {
    console.error('치명적 오류 발생:', error);
    process.exit(1);
  });
