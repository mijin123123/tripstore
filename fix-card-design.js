const fs = require('fs');
const path = require('path');

// 카드 디자인을 통일할 페이지 목록
const pages = [
  'src/app/domestic/hotel/page.tsx',
  'src/app/domestic/pool-villa/page.tsx',
  'src/app/overseas/europe/page.tsx',
  'src/app/overseas/japan/page.tsx', 
  'src/app/overseas/southeast-asia/page.tsx',
  'src/app/overseas/americas/page.tsx',
  'src/app/overseas/guam-saipan/page.tsx',
  'src/app/overseas/taiwan-hongkong-macau/page.tsx',
  'src/app/luxury/europe/page.tsx',
  'src/app/luxury/japan/page.tsx',
  'src/app/luxury/southeast-asia/page.tsx',
  'src/app/luxury/cruise/page.tsx',
  'src/app/luxury/special-theme/page.tsx'
];

function fixCardDesign(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    console.log(`Processing: ${filePath}`);
    
    // 1. 카드 컨테이너에 flex 레이아웃 추가
    content = content.replace(
      /className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow([^"]*)"(?!.*h-full)/g,
      'className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow$1 h-full flex flex-col"'
    );
    
    // 2. 이미지 컨테이너에 flex-shrink-0 추가
    content = content.replace(
      /className="(relative h-48[^"]*)"(?!.*flex-shrink-0)/g,
      'className="$1 flex-shrink-0"'
    );
    
    // 3. 카드 내용 div에 flex 레이아웃 추가
    content = content.replace(
      /className="p-6"(?!.*flex)/g,
      'className="p-6 flex flex-col flex-grow"'
    );
    
    // 4. 제목에 line-clamp-2 추가
    content = content.replace(
      /className="text-xl font-bold([^"]*)"(?!.*line-clamp)/g,
      'className="text-xl font-bold$1 line-clamp-2"'
    );
    
    // 5. 아이콘에 flex-shrink-0 추가
    content = content.replace(
      /className="w-4 h-4"(?!.*flex-shrink-0)/g,
      'className="w-4 h-4 flex-shrink-0"'
    );
    
    // 6. 텍스트에 truncate 추가
    content = content.replace(
      /className="text-sm"(?!.*truncate)/g,
      'className="text-sm truncate"'
    );
    
    // 7. 설명 부분에 flex-grow 추가
    content = content.replace(
      /className="mb-4">\s*<p className="text-gray-600 text-sm line-clamp-3"/g,
      'className="mb-4 flex-grow">\n                      <p className="text-gray-600 text-sm line-clamp-3"'
    );
    
    // 8. 가격/버튼 섹션에 mt-auto 추가
    content = content.replace(
      /className="flex items-center justify-between"(?!.*mt-auto)/g,
      'className="flex items-center justify-between mt-auto"'
    );
    
    // 9. 가격 div를 flex-col로 변경
    content = content.replace(
      /<div>\s*<span className="text-xl font-bold/g,
      '<div className="flex flex-col">\n                        <span className="text-xl font-bold'
    );
    
    // 10. 버튼에 flex-shrink-0 추가
    content = content.replace(
      /className="bg-([^"]*) text-white px-([^"]*) py-([^"]*) rounded-lg hover:bg-([^"]*) transition-colors"(?!.*flex-shrink-0)/g,
      'className="bg-$1 text-white px-$2 py-$3 rounded-lg hover:bg-$4 transition-colors flex-shrink-0"'
    );
    
    // 11. 별점 아이콘이 있는 div 제거
    content = content.replace(
      /<div className="absolute top-4 right-4 bg-white\/90 backdrop-blur-sm px-2 py-1 rounded-full">\s*<div className="flex items-center gap-1">\s*<Star className="w-4 h-4 flex-shrink-0" \/>\s*<span className="text-sm truncate">5<\/span>\s*<\/div>\s*<\/div>/g,
      ''
    );
    
    // 12. 호텔 카테고리명을 올바른 카테고리명으로 수정 (정확한 매칭)
    if (filePath.includes('domestic/hotel')) {
      content = content.replace(/호텔\/리조트\/리조트/g, '호텔/리조트');
      content = content.replace(/(?<!\/|리조트)호텔(?!\/)/g, '호텔/리조트');
    } else if (filePath.includes('domestic/pool-villa')) {
      content = content.replace(/풀빌라\/펜션\/펜션/g, '풀빌라/펜션');
      content = content.replace(/(?<!\/|펜션)풀빌라(?!\/)/g, '풀빌라/펜션');
    } else if (filePath.includes('overseas/japan')) {
      content = content.replace(/일본여행/g, '일본');
    } else if (filePath.includes('overseas/europe')) {
      content = content.replace(/유럽여행/g, '유럽');
    } else if (filePath.includes('overseas/southeast-asia')) {
      content = content.replace(/동남아시아여행/g, '동남아시아');
    } else if (filePath.includes('overseas/americas')) {
      content = content.replace(/미주여행/g, '미주');
    } else if (filePath.includes('overseas/guam-saipan')) {
      content = content.replace(/괌\/사이판여행/g, '괌/사이판');
    } else if (filePath.includes('overseas/taiwan-hongkong-macau')) {
      content = content.replace(/대만\/홍콩\/마카오여행/g, '대만/홍콩/마카오');
    } else if (filePath.includes('luxury/cruise')) {
      content = content.replace(/크루즈여행/g, '크루즈');
    } else if (filePath.includes('luxury/special-theme')) {
      content = content.replace(/특별테마여행/g, '특별테마');
    }
    
    // 13. 중복된 클래스 정리
    content = content.replace(/flex-shrink-0 flex-shrink-0/g, 'flex-shrink-0');
    content = content.replace(/line-clamp-2 line-clamp-2/g, 'line-clamp-2');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Successfully updated: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// 모든 페이지의 카드 디자인 통일
console.log('Starting card design fix for all pages...\n');

pages.forEach(page => {
  fixCardDesign(page);
});

console.log('\n✅ Card design fix completed for all pages!');
