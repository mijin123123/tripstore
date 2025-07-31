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
  if (!markdown) return null;
  
  // 이미지 태그를 찾아서 HTML로 변환
  const renderedContent = React.useMemo(() => {
    // 마크다운 이미지 문법 정규식: ![텍스트](URL)
    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
    
    // 먼저 줄바꿈을 <br> 태그로 변환
    let html = markdown.replace(/\n/g, '<br>');
    
    // Base64 이미지를 포함하는 마크다운을 HTML로 변환
    html = html.replace(imageRegex, (match, alt, src) => {
      console.log('마크다운 이미지 처리:', { alt, src: src.substring(0, 50) + (src.length > 50 ? '...' : '') });
      
      // Base64 이미지인 경우에만 특별히 처리
      if (src.startsWith('data:image')) {
        return `<div style="margin: 16px 0;"><img src="${src}" alt="${alt || '이미지'}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onerror="console.log('이미지 로드 실패:', this.src.substring(0, 50));" onload="console.log('이미지 로드 성공');" /></div>`;
      }
      
      // 일반 이미지 URL
      return `<div style="margin: 16px 0;"><img src="${src}" alt="${alt || '이미지'}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onerror="console.log('이미지 로드 실패:', this.src);" onload="console.log('이미지 로드 성공');" /></div>`;
    });
    
    return html;
  }, [markdown]);
  
  // 일반 텍스트와 이미지가 혼합된 내용을 표시하기 위해 dangerouslySetInnerHTML 사용
  // (이 방식은 신뢰할 수 있는 콘텐츠에만 사용해야 함)
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
