#!/usr/bin/env node

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

// CommonJS require 함수 생성
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// supabase 클라이언트 및 데이터 가져오기
import { createClient } from '@supabase/supabase-js';

// 환경 변수 로드
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// 패키지 데이터 가져오기
const { packagesData } = require('../data/packagesData.js');

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
    // UUID 생성 함수
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    // 기존 데이터 형식을 Supabase 스키마에 맞게 변환
    const formattedData = packagesData.map(pkg => {
      // 고유한 UUID 생성 (id 값을 시드로 사용하여 일관성 유지)
      const uuid = generateUUID();
      
      return {
        id: uuid, // 유효한 UUID 형식 사용
        title: pkg.name,
      description: pkg.description,
      destination: pkg.destination,
      price: parseFloat(pkg.price.replace(/[^\d.]/g, '')), // 가격에서 숫자만 추출
      discountprice: null, // 할인 가격 정보가 있다면 설정
      duration: pkg.duration ? parseInt(pkg.duration.split(' ')[0]) : null,
      departuredate: pkg.departureDate || [], // PostgreSQL은 식별자를 소문자로 저장하므로 departuredate로 변경
      images: [pkg.image], // 단일 이미지를 배열로 변환
      rating: pkg.rating || null,
      reviewcount: 0, // 리뷰 수 초기값
      category: pkg.type,        season: null, // 시즌 정보가 있다면 설정
        inclusions: pkg.includes || [],
        exclusions: pkg.excludes || [],
        isfeatured: false, // 추천 상품 여부
        isonsale: false, // 세일 상품 여부
        itinerary: pkg.itinerary ? JSON.stringify(pkg.itinerary) : null,
      };
    });
    
    console.log(`변환된 데이터 ${formattedData.length}개를 Supabase에 업로드합니다...`);
    
    // ID 매핑 정보 저장 (원본 ID → UUID)
    const idMapping = formattedData.map(item => ({
      originalId: packagesData.find(pkg => pkg.name === item.title).id,
      uuidId: item.id,
      title: item.title
    }));
    
    // 매핑 정보 출력
    console.log('ID 매핑 정보:');
    idMapping.forEach(map => {
      console.log(`원본 ID: ${map.originalId} → UUID: ${map.uuidId} (${map.title})`);
    });
    
    // 매핑 정보를 파일로 저장
    const fs = require('fs');
    const idMappingFileContent = `// 이 파일은 원본 패키지 ID와 Supabase에 저장된 UUID 간의 매핑을 저장합니다.
// 마이그레이션 후 자동으로 생성되었습니다.

export const idMapping = ${JSON.stringify(idMapping, null, 2)};
`;
    fs.writeFileSync('src/data/idMapping.js', idMappingFileContent);
    console.log('ID 매핑 정보가 src/data/idMapping.js에 저장되었습니다.');
    
    // Supabase에 데이터 삽입
    const { data, error } = await supabase
      .from('packages')
      .upsert(formattedData, {
        onConflict: 'id', // id가 중복되는 경우 업데이트
        ignoreDuplicates: false
      });
    
    if (error) {
      throw error;
    }
    
    console.log(`${formattedData.length}개의 패키지가 성공적으로 마이그레이션되었습니다.`);
    return { success: true, count: formattedData.length };
  } catch (error) {
    console.error('마이그레이션 중 오류가 발생했습니다:');
    console.error('오류 메시지:', error.message);
    console.error('오류 상세:', JSON.stringify(error, null, 2));
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
      console.error('마이그레이션 실패:');
      console.error('오류 상세:', JSON.stringify(result.error, null, 2));
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('예상치 못한 오류:', err);
    process.exit(1);
  });
