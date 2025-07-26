const fs = require('fs');
const path = require('path');

// 모든 카테고리 페이지
const allPages = [
  'src/app/domestic/page.tsx',
  'src/app/domestic/pool-villa/page.tsx',
  'src/app/domestic/hotel/page.tsx',
  'src/app/overseas/page.tsx',
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
  'src/app/hotel/page.tsx',
  'src/app/hotel/europe/page.tsx',
  'src/app/hotel/japan/page.tsx',
  'src/app/hotel/southeast-asia/page.tsx',
  'src/app/hotel/americas/page.tsx',
  'src/app/hotel/china-hongkong/page.tsx',
  'src/app/hotel/guam-saipan/page.tsx',
  'src/app/luxury/page.tsx',
  'src/app/luxury/europe/page.tsx',
  'src/app/luxury/japan/page.tsx',
  'src/app/luxury/southeast-asia/page.tsx',
  'src/app/luxury/cruise/page.tsx',
  'src/app/luxury/special-theme/page.tsx'
];

function fixCardDesignUrgent(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;
    
    console.log(`Fixing: ${filePath}`);
    
    // 1. 카드 컨테이너 클래스 강제 수정
    const cardContainerPattern = /className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow[^"]*"/g;
    if (cardContainerPattern.test(content)) {
      content = content.replace(
        cardContainerPattern,
        'className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"'
      );
      hasChanges = true;
    }
    
    // 2. 이미지 컨테이너 수정
    content = content.replace(
      /className="relative h-48[^"]*"/g,
      'className="relative h-48 flex-shrink-0"'
    );
    
    // 3. 콘텐츠 div 수정
    content = content.replace(
      /className="p-6[^"]*"/g,
      'className="p-6 flex flex-col flex-grow"'
    );
    
    // 4. 제목 수정
    content = content.replace(
      /className="text-xl font-bold text-gray-900 mb-2[^"]*"/g,
      'className="text-xl font-bold text-gray-900 mb-2 line-clamp-2"'
    );
    
    // 5. 아이콘 수정
    content = content.replace(
      /className="w-4 h-4[^"]*"/g,
      'className="w-4 h-4 flex-shrink-0"'
    );
    
    // 6. 텍스트 수정
    content = content.replace(
      /<span className="text-sm[^"]*">/g,
      '<span className="text-sm truncate">'
    );
    
    // 7. 설명 텍스트 수정
    content = content.replace(
      /<p className="text-gray-600 text-sm[^"]*">/g,
      '<p className="text-gray-600 text-sm line-clamp-3">'
    );
    
    // 8. mb-4 div를 flex-grow로 수정
    content = content.replace(
      /className="mb-4">/g,
      'className="mb-4 flex-grow">'
    );
    
    // 9. 하단 섹션에 mt-auto 추가
    content = content.replace(
      /className="flex items-center justify-between[^"]*"/g,
      'className="flex items-center justify-between mt-auto"'
    );
    
    if (hasChanges || content !== fs.readFileSync(fullPath, 'utf8')) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    } else {
      console.log(`✓ Already OK: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// 긴급 카드 디자인 수정
console.log('🚨 URGENT: Fixing card designs...\n');

allPages.forEach(page => {
  fixCardDesignUrgent(page);
});

console.log('\n✅ Urgent card design fix completed!');
