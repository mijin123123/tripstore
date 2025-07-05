-- STEP 3: 샘플 패키지 데이터 추가
INSERT INTO packages (title, destination, price, duration, category, image_url, available_dates, description, includes, excludes) VALUES
('나만의 수도 도쿄 여행', '일본 도쿄', 1290000, 5, '일본 여행과', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 
'2025-07-15, 2025-07-29, 2025-08-12, 2025-08-26, 2025-09-09, 2025-09-23', 
'도쿄의 다양한 명소를 즐기는 특별한 여행', 
'항공료, 4성급 호텔, 조식 4회, 전용 가이드', 
'점심 식사, 석식 관광, 개인 경비, 가이드/기사 팁'),

('서울 한옥마을 투어', '한국 서울', 890000, 3, '국내 관광', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
'2025-07-20, 2025-08-03, 2025-08-17, 2025-08-31', 
'전통 한옥마을에서 체험하는 한국의 아름다움',
'숙박료, 전통 체험, 한복 대여, 가이드 동행',
'개인 용돈, 추가 체험비, 교통비'),

('부산 해운대 바다 여행', '한국 부산', 650000, 2, '국내 관광', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
'2025-07-25, 2025-08-08, 2025-08-22', 
'부산의 아름다운 바다와 맛있는 음식을 즐기는 여행',
'숙박료, 조식, 가이드 동행, 해운대 투어',
'개인 용돈, 점심/저녁 식사, 교통비');
