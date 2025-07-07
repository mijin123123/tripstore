import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 숫자를 한국 통화 형식으로 포맷팅합니다.
 * @param amount 포맷팅할 금액
 * @returns 포맷팅된 통화 문자열
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '₩0';
  
  // 객체인 경우 (Drizzle의 BigInt 타입 등)
  if (typeof amount === 'object' && amount !== null) {
    // PostgreSQL의 Decimal 타입이 객체로 반환될 경우 toString을 시도
    if ('toString' in amount && typeof amount.toString === 'function') {
      return formatCurrency(amount.toString());
    }
    return '₩0';
  }
  
  let numericAmount: number;
  
  if (typeof amount === 'string') {
    // 쉼표와 통화 기호 제거
    const cleanedString = amount.replace(/[^0-9.-]/g, '');
    numericAmount = parseFloat(cleanedString);
  } else {
    numericAmount = amount;
  }
  
  if (isNaN(numericAmount)) return '₩0';
  
  return new Intl.NumberFormat('ko-KR', { 
    style: 'currency', 
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(numericAmount);
}

/**
 * 날짜를 한국 형식으로 포맷팅합니다.
 * @param dateString 포맷팅할 날짜 문자열
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    return dateString;
  }
}

/**
 * 날짜 형식을 YYYY-MM-DD 형태로 변환합니다.
 * @param dateString 날짜 문자열
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDateToYYYYMMDD(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    return dateString;
  }
}

/**
 * 시간 간격을 계산하여 "n일 전", "n시간 전" 등의 형태로 반환합니다.
 * @param dateString 날짜 문자열
 * @returns 시간 간격 문자열
 */
export function getTimeAgo(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) return '';
    
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}초 전`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분 전`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}일 전`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}개월 전`;
    
    const years = Math.floor(months / 12);
    return `${years}년 전`;
  } catch (error) {
    return dateString;
  }
}

/**
 * 문자열이 이메일 형식인지 검증합니다.
 * @param email 검증할 이메일 문자열
 * @returns 유효성 여부
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

/**
 * 문자열에서 특수문자를 제거합니다.
 * @param str 처리할 문자열
 * @returns 특수문자가 제거된 문자열
 */
export function removeSpecialChars(str: string): string {
  return str.replace(/[^\w\s가-힣]/g, '');
}

/**
 * 한국 전화번호 형식으로 포맷팅합니다.
 * @param phoneNumber 전화번호 문자열
 * @returns 포맷팅된 전화번호
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';
  
  // 숫자만 추출
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // 길이에 따라 포맷팅
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
}

/**
 * 배열을 섞습니다 (피셔-예이츠 알고리즘).
 * @param array 섞을 배열
 * @returns 섞인 새 배열
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
