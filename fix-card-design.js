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
  'src/app/overseas/china-hongkong/page.tsx',
  'src/app/overseas/guam-saipan/page.tsx',
  'src/app/overseas/taiwan/page.tsx',
  'src/app/overseas/saipan/page.tsx',
  'src/app/overseas/macau/page.tsx',
  'src/app/overseas/hongkong/page.tsx',
  'src/app/overseas/guam/page.tsx',
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
