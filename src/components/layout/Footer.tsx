import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">TripStore</h3>
            <p className="text-sm text-neutral-600">
              최고의 여행 경험을 제공합니다. 전 세계의 숨겨진 보석 같은 여행지를 TripStore와 함께 발견하세요.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold text-neutral-800 mb-4">회사</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-neutral-600 hover:text-brand-blue transition-colors">회사 소개</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-brand-blue transition-colors">채용</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-brand-blue transition-colors">프레스</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold text-neutral-800 mb-4">고객 지원</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/notice" className="text-neutral-600 hover:text-brand-blue transition-colors">공지사항</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-brand-blue transition-colors">자주 묻는 질문</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-brand-blue transition-colors">문의하기</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold text-neutral-800 mb-4">소셜 미디어</h4>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="text-neutral-500 hover:text-brand-blue transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-neutral-500 hover:text-brand-blue transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-neutral-500 hover:text-brand-blue transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-neutral-500 hover:text-brand-blue transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-200 pt-8 text-center text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} TripStore. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="hover:text-brand-blue mx-2 transition-colors">개인정보처리방침</a>
            <span className="text-neutral-400">|</span>
            <a href="#" className="hover:text-brand-blue mx-2 transition-colors">이용약관</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
