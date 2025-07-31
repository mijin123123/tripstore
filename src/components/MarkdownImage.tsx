'use client'

import React from 'react';

interface MarkdownImageProps {
  markdown: string;
}

/**
 * 마크다운 이미지 문법을 HTML로 렌더링하는 컴포넌트
 * ![이미지](data:image/png;base64,...) 같은 형식을 <img> 태그로 변환
 */
export default function MarkdownImage({ markdown }: MarkdownImageProps) {
  console.log('MarkdownImage 컴포넌트 호출됨:', { markdown: markdown?.substring(0, 100) + (markdown?.length > 100 ? '...' : '') });
  
  if (!markdown) {
    console.log('MarkdownImage: markdown이 없음');
    return null;
  }
  
  // 이미지 태그를 찾아서 HTML로 변환
  const renderedContent = React.useMemo(() => {
    console.log('MarkdownImage: 렌더링 시작, 전체 마크다운 길이:', markdown.length);
    
    // 마크다운 이미지 문법 정규식: ![텍스트](URL)
    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
    
    // 이미지 매치 확인
    const matches = [...markdown.matchAll(imageRegex)];
    console.log('MarkdownImage: 발견된 이미지 개수:', matches.length);
    matches.forEach((match, index) => {
      console.log(`이미지 ${index + 1}:`, { 
        alt: match[1], 
        src: match[2]?.substring(0, 50) + (match[2]?.length > 50 ? '...' : '') 
      });
    });
    
    // 먼저 줄바꿈을 <br> 태그로 변환
    let html = markdown.replace(/\n/g, '<br>');
    
    // Base64 이미지를 포함하는 마크다운을 HTML로 변환
    html = html.replace(imageRegex, (match, alt, src) => {
      console.log('마크다운 이미지 처리:', { alt, src: src.substring(0, 50) + (src.length > 50 ? '...' : '') });
      
      // 잘못된 URL 처리
      if (!src || src.trim() === '') {
        console.log('빈 이미지 URL 발견, 건너뜀');
        return '';
      }
      
      // Base64 이미지인 경우에만 특별히 처리
      if (src.startsWith('data:image')) {
        console.log('Base64 이미지 처리 중');
        // Base64 이미지가 완전한지 확인
        if (src.includes(',')) {
          return `<div style="margin: 16px 0;"><img src="${src}" alt="${alt || '이미지'}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onerror="console.error('Base64 이미지 로드 실패:', this.alt); this.style.display='none';" onload="console.log('Base64 이미지 로드 성공:', this.alt);" /></div>`;
        } else {
          console.log('불완전한 Base64 이미지 데이터, 건너뜀');
          return '';
        }
      }
      
      // HTTP/HTTPS URL인 경우
      if (src.startsWith('http://') || src.startsWith('https://')) {
        console.log('HTTP/HTTPS URL 이미지 처리 중');
        return `<div style="margin: 16px 0;"><img src="${src}" alt="${alt || '이미지'}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onerror="console.error('URL 이미지 로드 실패:', this.src); this.style.display='none';" onload="console.log('URL 이미지 로드 성공:', this.alt);" /></div>`;
      }
      
      // 상대 경로인 경우
      console.log('상대 경로 또는 기타 이미지 처리 중');
      return `<div style="margin: 16px 0;"><img src="${src}" alt="${alt || '이미지'}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onerror="console.error('이미지 로드 실패:', this.src); this.style.display='none';" onload="console.log('이미지 로드 성공:', this.alt);" /></div>`;
    });
    
    console.log('MarkdownImage: 최종 HTML 길이:', html.length);
    return html;
  }, [markdown]);
  
  // 일반 텍스트와 이미지가 혼합된 내용을 표시하기 위해 dangerouslySetInnerHTML 사용
  // (이 방식은 신뢰할 수 있는 콘텐츠에만 사용해야 함)
  
  // 컴포넌트 마운트 시 CSS 스타일 추가
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingStyle = document.head.querySelector('style[data-markdown-image]');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.textContent = `
          .markdown-content img {
            transition: opacity 0.3s ease;
          }
          .markdown-content img[style*="display: none"] {
            display: none !important;
          }
        `;
        style.setAttribute('data-markdown-image', 'true');
        document.head.appendChild(style);
      }
    }
  }, []);
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: renderedContent }} 
      className="markdown-content"
      style={{
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        lineHeight: '1.6'
      }}
    />
  );
}
