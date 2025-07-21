-- 사이트 설정 테이블 생성
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_group TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX site_settings_key_idx ON site_settings(setting_key);
CREATE INDEX site_settings_group_idx ON site_settings(setting_group);

-- 초기 데이터 삽입: 푸터 정보
INSERT INTO site_settings (setting_key, setting_value, setting_group, description)
VALUES 
  ('footer_company_name', '트립스토어 주식회사', 'footer', '회사명'),
  ('footer_ceo', '홍길동', 'footer', '대표자명'),
  ('footer_business_number', '123-45-67890', 'footer', '사업자등록번호'),
  ('footer_mail_order_business', '제2023-서울강남-1234호', 'footer', '통신판매업신고번호'),
  ('footer_address', '서울특별시 강남구 테헤란로 123, 4층', 'footer', '회사 주소'),
  ('footer_tel', '02-1234-5678', 'footer', '대표 전화번호'),
  ('footer_email', 'help@tripstore.co.kr', 'footer', '이메일'),
  ('footer_customer_service_hours', '평일 09:00 - 18:00 (점심시간 12:00 - 13:00)', 'footer', '고객센터 운영시간'),
  ('footer_kakao_qr', '', 'footer', '카카오톡 QR코드 이미지 (Base64 인코딩)'),
  ('footer_copyright', '© 2025 트립스토어 All Rights Reserved.', 'footer', '저작권 정보');

-- 초기 데이터 삽입: 결제 정보
INSERT INTO site_settings (setting_key, setting_value, setting_group, description)
VALUES 
  ('payment_bank_name', '신한은행', 'payment', '은행명'),
  ('payment_account_number', '123-456-789012', 'payment', '계좌번호'),
  ('payment_account_holder', '트립스토어(주)', 'payment', '예금주'),
  ('payment_instruction', '입금 시 예약자 성함으로 입금해주세요.', 'payment', '입금 안내사항'),
  ('payment_confirmation_time', '평일 기준 1-2시간 이내', 'payment', '입금 확인 소요시간');
