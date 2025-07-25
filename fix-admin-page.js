// 관리자 페이지 수정 스크립트
const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const adminPagePath = path.join(__dirname, 'src', 'app', 'admin', 'page.tsx');

try {
  // 파일 읽기
  const content = fs.readFileSync(adminPagePath, 'utf8');
  
  // 오류가 있는 부분 수정
  let fixedContent = content
    // 세미콜론 추가
    .replace(/}\s*\)\s*$/, '});')
    // 마지막 괄호 닫기 수정
    .replace(/\s*\)\s*}\s*$/, '  );\n}');
  
  // 정규식으로 구조 수정하기 어려운 경우 전체 코드를 다시 확인
  if (fixedContent === content) {
    console.log('변경 사항이 없습니다. 파일이 이미 정상이거나 다른 문제가 있습니다.');
  } else {
    // 수정된 내용으로 파일 쓰기
    fs.writeFileSync(adminPagePath, fixedContent, 'utf8');
    console.log('admin/page.tsx 파일이 성공적으로 수정되었습니다.');
  }
} catch (error) {
  console.error('파일 수정 중 오류 발생:', error);
}
