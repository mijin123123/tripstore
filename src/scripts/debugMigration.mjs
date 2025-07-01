#!/usr/bin/env node

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

// CommonJS require 함수 생성
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수 로드
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// supabase 클라이언트 생성
import { createClient } from '@supabase/supabase-js';

// 패키지 데이터 가져오기
const { packagesData } = require('../data/packagesData.js');

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? '설정됨' : '설정되지 않음');
console.log('Supabase Anon Key:', supabaseAnonKey ? '설정됨' : '설정되지 않음');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL과 Anonymous Key가 설정되지 않았습니다.');
  console.error('환경 변수 NEXT_PUBLIC_SUPABASE_URL 및 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * packagesData.ts에서 Supabase로 데이터를 마이그레이션하는 함수
 */
async function migratePackagesData() {
  console.log('패키지 데이터 마이그레이션을 시작합니다...');
  
  try {
    // packages 테이블이 존재하는지 확인
    const { data: tableExists, error: tableError } = await supabase
      .from('packages')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('테이블 확인 중 오류 발생:', tableError.message);
      console.error('테이블이 존재하지 않을 수 있습니다. Supabase에서 스키마를 먼저 실행해주세요.');
      return { success: false, error: tableError };
    }
    
    console.log('패키지 테이블 확인 완료:', tableExists ? '테이블 존재함' : '테이블 비어있음');
    
    // 기존 데이터 형식을 Supabase 스키마에 맞게 변환
    const formattedData = packagesData.map(pkg => ({
      id: pkg.id.toString(), // Supabase에서는 id를 UUID로 저장하지만, 기존 데이터를 유지하기 위해 문자열로 변환
      title: pkg.name,
      description: pkg.description,
      destination: pkg.destination,
      price: parseFloat(pkg.price.replace(/[^\d.]/g, '')), // 가격에서 숫자만 추출
      discountPrice: null, // 할인 가격 정보가 있다면 설정
      duration: pkg.duration ? parseInt(pkg.duration.split(' ')[0]) : null,
      departureDate: pkg.departureDate || [],
      images: [pkg.image], // 단일 이미지를 배열로 변환
      rating: pkg.rating || null,
      reviewCount: 0, // 리뷰 수 초기값
      category: pkg.type,
      season: null, // 시즌 정보가 있다면 설정
      inclusions: pkg.includes || [],
      exclusions: pkg.excludes || [],
      isFeatured: false, // 추천 상품 여부
      isOnSale: false, // 세일 상품 여부
      itinerary: pkg.itinerary ? JSON.stringify(pkg.itinerary) : null,
    }));
    
    console.log(`변환된 데이터 ${formattedData.length}개를 Supabase에 업로드합니다...`);
    console.log('첫 번째 패키지 샘플:', JSON.stringify(formattedData[0], null, 2));
    
    // Supabase에 데이터 삽입
    const { data, error } = await supabase
      .from('packages')
      .upsert(formattedData, {
        onConflict: 'id', // id가 중복되는 경우 업데이트
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error('Supabase 업로드 중 오류:', error.message);
      console.error('오류 코드:', error.code);
      console.error('오류 상세 정보:', error.details || '상세 정보 없음');
      return { success: false, error };
    }
    
    console.log(`${formattedData.length}개의 패키지가 성공적으로 마이그레이션되었습니다.`);
    return { success: true, count: formattedData.length, data };
  } catch (error) {
    console.error('마이그레이션 중 예상치 못한 오류가 발생했습니다:');
    console.error('오류 유형:', error.constructor.name);
    console.error('오류 메시지:', error.message);
    console.error('스택 트레이스:', error.stack);
    return { success: false, error };
  }
}

// 마이그레이션 실행
migratePackagesData()
  .then(result => {
    if (result.success) {
      console.log('마이그레이션이 성공적으로 완료되었습니다.');
      process.exit(0);
    } else {
      console.error('마이그레이션 실패');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('마이그레이션 함수 실행 중 캐치되지 않은 오류:', err);
    process.exit(1);
  });
