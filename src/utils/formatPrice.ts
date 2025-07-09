/**
 * 가격을 원화 형식으로 포맷팅합니다.
 * @param price - 가격 (문자열 또는 숫자)
 * @returns 포맷팅된 가격 문자열
 */
export function formatPrice(price: string | number): string {
  if (!price) return "가격 문의";
  
  // 문자열에서 숫자만 추출
  const numericPrice = typeof price === 'string' 
    ? price.replace(/[^0-9]/g, '') 
    : price.toString();
  
  if (!numericPrice || numericPrice === '0') return "가격 문의";
  
  // 숫자로 변환하고 쉼표 추가
  const number = parseInt(numericPrice);
  if (isNaN(number)) return "가격 문의";
  
  return `₩${number.toLocaleString('ko-KR')}`;
}

/**
 * 가격 문자열에서 숫자만 추출합니다.
 * @param price - 가격 문자열
 * @returns 숫자
 */
export function extractPrice(price: string | number): number {
  if (typeof price === 'number') return price;
  
  const numericPrice = price.replace(/[^0-9]/g, '');
  return parseInt(numericPrice) || 0;
}
