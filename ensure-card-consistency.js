const fs = require('fs');
const path = require('path');

// 모든 카테고리 페이지 (이전에 놓쳤을 수 있는 페이지들 포함)
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

function ensureConsistentCardDesign(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    // 파일 존재 확인
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;
    
    console.log(`Checking: ${filePath}`);
    
    // 1. 카드 컨테이너에 완전한 flex 레이아웃 확인
    const cardContainerRegex = /className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow([^"]*)"(?!.*h-full.*flex.*flex-col)/g;
    if (cardContainerRegex.test(content)) {
      content = content.replace(
        /className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow([^"]*)"(?!.*h-full.*flex.*flex-col)/g,
        'className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow$1 h-full flex flex-col"'
      );
      hasChanges = true;
    }
    
    // 2. 이미지 컨테이너에 flex-shrink-0 확인
    const imageContainerRegex = /className="(relative h-48[^"]*)"(?!.*flex-shrink-0)/g;
    if (imageContainerRegex.test(content)) {
      content = content.replace(imageContainerRegex, 'className="$1 flex-shrink-0"');
      hasChanges = true;
    }
    
    // 3. 콘텐츠 div에 flex 레이아웃 확인 (p-6)
    const contentRegex6 = /className="p-6"(?!.*flex.*flex-col.*flex-grow)/g;
    if (contentRegex6.test(content)) {
      content = content.replace(contentRegex6, 'className="p-6 flex flex-col flex-grow"');
      hasChanges = true;
    }
    
    // 4. 콘텐츠 div에 flex 레이아웃 확인 (p-4)
    const contentRegex4 = /className="p-4"(?!.*flex.*flex-col.*flex-grow)/g;
    if (contentRegex4.test(content)) {
      content = content.replace(contentRegex4, 'className="p-4 flex flex-col flex-grow"');
      hasChanges = true;
    }
    
    // 5. 제목에 line-clamp-2 확인
    const titleRegex = /className="text-xl font-bold([^"]*)"(?!.*line-clamp-2)/g;
    if (titleRegex.test(content)) {
      content = content.replace(titleRegex, 'className="text-xl font-bold$1 line-clamp-2"');
      hasChanges = true;
    }
    
    // 6. 설명 컨테이너에 flex-grow 확인
    const descRegex = /className="mb-4">\s*<p className="text-gray-600([^"]*)"(?!.*flex-grow)/g;
    if (descRegex.test(content)) {
      content = content.replace(
        /className="mb-4">\s*<p className="text-gray-600([^"]*)"/g,
        'className="mb-4 flex-grow">\n                      <p className="text-gray-600$1"'
      );
      hasChanges = true;
    }
    
    // 7. 하단 섹션에 mt-auto 확인
    const bottomRegex = /className="flex items-center justify-between"(?!.*mt-auto)/g;
    if (bottomRegex.test(content)) {
      content = content.replace(bottomRegex, 'className="flex items-center justify-between mt-auto"');
      hasChanges = true;
    }
    
    if (hasChanges) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`✓ Already consistent: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// 모든 페이지의 카드 디자인 일관성 확인 및 수정
console.log('Ensuring consistent card design across all pages...\n');

allPages.forEach(page => {
  ensureConsistentCardDesign(page);
});

console.log('\n✅ Card design consistency check completed!');
