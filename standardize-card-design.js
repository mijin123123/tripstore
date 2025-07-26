const fs = require('fs');
const path = require('path');

// 모든 카테고리 페이지
const allPages = [
  'src/app/domestic/page.tsx',
  'src/app/domestic/resort/page.tsx',
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

function standardizeCardDesign(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;
    
    console.log(`Processing: ${filePath}`);
    
    // 1. 중복된 클래스 제거 및 표준화
    // 카드 컨테이너 클래스 정리
    const duplicateCardClass = /className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow[^"]*cursor-pointer[^"]*h-full[^"]*flex[^"]*flex-col[^"]*cursor-pointer[^"]*h-full[^"]*flex[^"]*flex-col[^"]*"/g;
    if (duplicateCardClass.test(content)) {
      content = content.replace(duplicateCardClass, 'className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"');
      hasChanges = true;
    }
    
    // 2. 일반적인 카드 컨테이너 표준화
    const cardContainerRegex = /className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow([^"]*)"/g;
    content = content.replace(cardContainerRegex, (match, additionalClasses) => {
      // 필수 클래스들이 없으면 추가
      let classes = 'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow';
      
      if (!additionalClasses.includes('cursor-pointer')) {
        classes += ' cursor-pointer';
      }
      if (!additionalClasses.includes('h-full')) {
        classes += ' h-full';
      }
      if (!additionalClasses.includes('flex flex-col')) {
        classes += ' flex flex-col';
      }
      
      // 기존 추가 클래스도 포함 (중복 제거)
      const existingClasses = additionalClasses.trim().split(/\s+/).filter(cls => 
        cls && !['cursor-pointer', 'h-full', 'flex', 'flex-col'].includes(cls)
      );
      
      if (existingClasses.length > 0) {
        classes += ' ' + existingClasses.join(' ');
      }
      
      return `className="${classes}"`;
    });
    
    // 3. 이미지 컨테이너 중복 클래스 제거
    const duplicateImageClass = /className="(relative h-48[^"]*flex-shrink-0[^"]*flex-shrink-0[^"]*flex-shrink-0[^"]*)"/g;
    if (duplicateImageClass.test(content)) {
      content = content.replace(duplicateImageClass, 'className="relative h-48 flex-shrink-0"');
      hasChanges = true;
    }
    
    // 4. 일반적인 이미지 컨테이너 표준화
    const imageContainerRegex = /className="(relative h-48[^"]*)"/g;
    content = content.replace(imageContainerRegex, (match, classes) => {
      if (!classes.includes('flex-shrink-0')) {
        return `className="${classes} flex-shrink-0"`;
      }
      return match;
    });
    
    // 5. 콘텐츠 div 표준화 (p-6)
    const contentRegex6 = /className="p-6([^"]*)"/g;
    content = content.replace(contentRegex6, (match, additionalClasses) => {
      let classes = 'p-6';
      if (!additionalClasses.includes('flex flex-col flex-grow')) {
        classes += ' flex flex-col flex-grow';
      }
      
      const existingClasses = additionalClasses.trim().split(/\s+/).filter(cls => 
        cls && !['flex', 'flex-col', 'flex-grow'].includes(cls)
      );
      
      if (existingClasses.length > 0) {
        classes += ' ' + existingClasses.join(' ');
      }
      
      return `className="${classes}"`;
    });
    
    // 6. 제목 중복 클래스 제거
    const duplicateTitleClass = /className="text-xl font-bold([^"]*line-clamp-2[^"]*line-clamp-2[^"]*line-clamp-2[^"]*)"/g;
    if (duplicateTitleClass.test(content)) {
      content = content.replace(duplicateTitleClass, 'className="text-xl font-bold text-gray-900 mb-2 line-clamp-2"');
      hasChanges = true;
    }
    
    // 7. 제목 표준화
    const titleRegex = /className="text-xl font-bold([^"]*)"/g;
    content = content.replace(titleRegex, (match, additionalClasses) => {
      let classes = 'text-xl font-bold text-gray-900 mb-2';
      if (!additionalClasses.includes('line-clamp-2')) {
        classes += ' line-clamp-2';
      }
      return `className="${classes}"`;
    });
    
    // 8. 아이콘 표준화
    const iconRegex = /className="w-4 h-4([^"]*)"/g;
    content = content.replace(iconRegex, (match, additionalClasses) => {
      let classes = 'w-4 h-4';
      if (!additionalClasses.includes('flex-shrink-0')) {
        classes += ' flex-shrink-0';
      }
      return `className="${classes}"`;
    });
    
    // 9. 텍스트 중복 클래스 제거
    const duplicateTextClass = /className="text-sm([^"]*truncate[^"]*truncate[^"]*)"/g;
    if (duplicateTextClass.test(content)) {
      content = content.replace(duplicateTextClass, 'className="text-sm truncate"');
      hasChanges = true;
    }
    
    // 10. 텍스트 표준화
    const textRegex = /className="text-sm([^"]*)"/g;
    content = content.replace(textRegex, (match, additionalClasses) => {
      let classes = 'text-sm';
      if (!additionalClasses.includes('truncate') && !additionalClasses.includes('line-clamp')) {
        classes += ' truncate';
      }
      
      const existingClasses = additionalClasses.trim().split(/\s+/).filter(cls => 
        cls && cls !== 'truncate'
      );
      
      if (existingClasses.length > 0) {
        classes += ' ' + existingClasses.join(' ');
      }
      
      return `className="${classes}"`;
    });
    
    // 11. 설명 부분 표준화
    const descRegex = /className="mb-4([^"]*)">[\s\n]*<p className="text-gray-600([^"]*)"/g;
    content = content.replace(descRegex, (match, containerClasses, textClasses) => {
      let containerClass = 'mb-4';
      if (!containerClasses.includes('flex-grow')) {
        containerClass += ' flex-grow';
      }
      
      let textClass = 'text-gray-600 text-sm';
      if (!textClasses.includes('line-clamp-3')) {
        textClass += ' line-clamp-3';
      }
      
      return `className="${containerClass}">\n                      <p className="${textClass}"`;
    });
    
    // 12. 하단 섹션 표준화
    const bottomRegex = /className="flex items-center justify-between([^"]*)"/g;
    content = content.replace(bottomRegex, (match, additionalClasses) => {
      let classes = 'flex items-center justify-between';
      if (!additionalClasses.includes('mt-auto')) {
        classes += ' mt-auto';
      }
      return `className="${classes}"`;
    });
    
    // 13. 그리드 레이아웃 표준화 (국내 호텔 스타일로)
    const gridRegex = /className="grid[^"]*"/g;
    content = content.replace(gridRegex, 'className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"');
    
    if (hasChanges || content !== fs.readFileSync(fullPath, 'utf8')) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Standardized: ${filePath}`);
    } else {
      console.log(`✓ Already standardized: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// 모든 페이지의 카드 디자인을 국내 호텔 스타일로 표준화
console.log('Standardizing all card designs to match domestic hotel style...\n');

allPages.forEach(page => {
  standardizeCardDesign(page);
});

console.log('\n✅ Card design standardization completed!');
