const fs = require('fs');
const path = require('path');

// 페이지네이션을 추가할 페이지 목록
const pages = [
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
  'src/app/hotel/europe/page.tsx',
  'src/app/hotel/japan/page.tsx',
  'src/app/hotel/southeast-asia/page.tsx',
  'src/app/hotel/americas/page.tsx',
  'src/app/hotel/china-hongkong/page.tsx',
  'src/app/hotel/guam-saipan/page.tsx',
  'src/app/luxury/europe/page.tsx',
  'src/app/luxury/japan/page.tsx',
  'src/app/luxury/southeast-asia/page.tsx',
  'src/app/luxury/cruise/page.tsx',
  'src/app/luxury/special-theme/page.tsx',
  'src/app/domestic/page.tsx',
  'src/app/luxury/page.tsx'
];

function addPaginationToPage(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    console.log(`Processing: ${filePath}`);
    
    // 1. ChevronLeft, ChevronRight import 추가
    if (!content.includes('ChevronLeft') && !content.includes('ChevronRight')) {
      content = content.replace(
        /import.*from 'lucide-react'/,
        (match) => {
          if (match.includes('ChevronLeft')) return match;
          return match.replace(' }', ', ChevronLeft, ChevronRight }');
        }
      );
    }
    
    // 2. useState 훅 추가 (currentPage와 packagesPerPage)
    if (!content.includes('currentPage')) {
      // useState import가 있는지 확인
      if (content.includes("'use client'")) {
        // 기존 state 선언 다음에 추가
        content = content.replace(
          /const \[([^,]+), set[^]]*\] = useState\([^)]*\)/,
          (match) => {
            return match + `\n  const [currentPage, setCurrentPage] = useState(1)\n  const packagesPerPage = 12`;
          }
        );
      }
    }
    
    // 3. 페이지네이션 로직 추가
    if (!content.includes('totalPages')) {
      const paginationLogic = `
  // 페이지네이션 계산
  const totalPages = Math.ceil(packages.length / packagesPerPage)
  const startIndex = (currentPage - 1) * packagesPerPage
  const endIndex = startIndex + packagesPerPage
  const currentPackages = packages.slice(startIndex, endIndex)

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
`;
      
      // useEffect 후에 추가
      content = content.replace(
        /}, \[\]\);?\s*\n/,
        (match) => {
          return match + paginationLogic;
        }
      );
    }
    
    // 4. 그리드 레이아웃을 xl:grid-cols-4로 변경
    content = content.replace(
      /grid.*md:grid-cols-[23].*lg:grid-cols-[23](?!.*xl)/g,
      (match) => {
        return match + ' xl:grid-cols-4';
      }
    );
    
    // 5. packages.map을 currentPackages.map으로 변경
    content = content.replace(/packages\.map/g, 'currentPackages.map');
    
    // 6. 페이지네이션 컴포넌트 추가
    if (!content.includes('페이지네이션')) {
      const paginationComponent = `
          {/* 페이지네이션 */}
          {packages.length > packagesPerPage && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={\`flex items-center px-3 py-2 rounded-lg \${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }\`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                이전
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={\`px-3 py-2 rounded-lg \${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }\`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={\`flex items-center px-3 py-2 rounded-lg \${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }\`}
              >
                다음
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}`;
      
      // 패키지 목록이 끝나는 </div> 다음에 추가
      content = content.replace(
        /(\s*)}>\s*\n\s*<\/div>\s*\n\s*<\/div>\s*\n\s*<\/section>/,
        (match) => {
          return match.replace('</div>\n        </div>\n      </section>', 
            `</div>${paginationComponent}\n        </div>\n      </section>`);
        }
      );
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Successfully updated: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// 모든 페이지에 페이지네이션 추가
console.log('Starting pagination addition to all pages...\n');

pages.forEach(page => {
  addPaginationToPage(page);
});

console.log('\n✅ Pagination addition completed for all pages!');
