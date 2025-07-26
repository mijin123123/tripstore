const fs = require('fs');
const path = require('path');

// 추가로 수정이 필요한 페이지들
const additionalPages = [
  'src/app/hotel/page.tsx',
  'src/app/domestic/hotel/page.tsx',
  'src/app/about/page.tsx'
];

function fixCardDesignAdditional(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    console.log(`Processing: ${filePath}`);
    
    // 1. 메인 호텔 페이지의 지역 카드에 flex 레이아웃 추가
    content = content.replace(
      /className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"(?!.*h-full)/g,
      'className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"'
    );
    
    // 2. 일반 카드 컨테이너에 flex 레이아웃 추가
    content = content.replace(
      /className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"(?!.*h-full)/g,
      'className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col"'
    );
    
    // 3. 카드 컨테이너에 cursor-pointer가 없는 경우 추가
    content = content.replace(
      /className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow([^"]*) h-full flex flex-col"(?!.*cursor-pointer)/g,
      'className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow$1 h-full flex flex-col cursor-pointer"'
    );
    
    // 4. 이미지 컨테이너에 flex-shrink-0 추가
    content = content.replace(
      /className="(relative h-48[^"]*)"(?!.*flex-shrink-0)/g,
      'className="$1 flex-shrink-0"'
    );
    
    // 5. 내용 div에 flex 레이아웃 추가 (p-6 클래스가 있는 경우)
    content = content.replace(
      /className="p-6"(?!.*flex)/g,
      'className="p-6 flex flex-col flex-grow"'
    );
    
    // 6. 내용 div에 flex 레이아웃 추가 (p-4 클래스가 있는 경우)
    content = content.replace(
      /className="p-4"(?!.*flex)/g,
      'className="p-4 flex flex-col flex-grow"'
    );
    
    // 7. 제목에 line-clamp 추가
    content = content.replace(
      /className="text-xl font-bold([^"]*)"(?!.*line-clamp)/g,
      'className="text-xl font-bold$1 line-clamp-2"'
    );
    
    // 8. 텍스트에 truncate 추가
    content = content.replace(
      /className="text-sm([^"]*)"(?!.*truncate)(?!.*line-clamp)/g,
      'className="text-sm$1 truncate"'
    );
    
    // 9. 설명 부분에 flex-grow 추가
    content = content.replace(
      /className="mb-4">\s*<p className="text-gray-600([^"]*)"(?!.*flex-grow)/g,
      'className="mb-4 flex-grow">\n                      <p className="text-gray-600$1"'
    );
    
    // 10. 가격/버튼 섹션에 mt-auto 추가
    content = content.replace(
      /className="flex items-center justify-between"(?!.*mt-auto)/g,
      'className="flex items-center justify-between mt-auto"'
    );
    
    // 11. 버튼에 flex-shrink-0 추가
    content = content.replace(
      /className="([^"]*bg-[^"]*text-white[^"]*)"(?!.*flex-shrink-0)/g,
      'className="$1 flex-shrink-0"'
    );
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Successfully updated: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// 추가 페이지들의 카드 디자인 수정
console.log('Starting additional card design fix...\n');

additionalPages.forEach(page => {
  fixCardDesignAdditional(page);
});

console.log('\n✅ Additional card design fix completed!');
