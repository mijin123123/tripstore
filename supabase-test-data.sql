-- Supabase 테스트 데이터 삽입 스크립트
-- Supabase Dashboard의 SQL Editor에서 실행하세요

-- 1. 테스트 사용자 삽입
INSERT INTO users (email, password_hash, name, role) VALUES
('test@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.8XCwUb8Y4bYgC4rO6.UE6HTMT6VVJW', '테스트 사용자', 'user'),
('admin@tripstore.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXe5Y4ZP7/E5k5r8K5zZQKj5L6RMFY/KOC', '관리자', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2. 샘플 패키지 삽입
INSERT INTO packages (title, description, price, duration, location, category, image_url) VALUES
('제주도 3박 4일', '아름다운 제주도에서 즐기는 힐링 여행', 350000, '3박 4일', '제주도', '국내여행', 'https://images.unsplash.com/photo-1539650116574-75c0c6d81d3d'),
('부산 바다 여행', '부산의 멋진 해변과 맛있는 음식을 즐기는 여행', 280000, '2박 3일', '부산', '국내여행', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'),
('일본 도쿄 5일', '도쿄의 전통과 현대가 만나는 특별한 여행', 850000, '4박 5일', '도쿄, 일본', '해외여행', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf'),
('태국 방콕 패키지', '태국의 황금 사원과 맛있는 음식 투어', 650000, '3박 4일', '방콕, 태국', '해외여행', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'),
('경주 역사 탐방', '신라 천년의 역사를 체험하는 문화 여행', 220000, '1박 2일', '경주', '국내여행', 'https://images.unsplash.com/photo-1570197788417-0e82375c9371'),
('강릉 바다 힐링', '동해의 푸른 바다와 함께하는 힐링 여행', 180000, '1박 2일', '강릉', '국내여행', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'),
('유럽 3국 투어', '프랑스, 독일, 이탈리아를 한번에!', 1850000, '7박 8일', '유럽', '해외여행', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b'),
('몰디브 허니문', '신혼부부를 위한 로맨틱 몰디브 여행', 2500000, '5박 6일', '몰디브', '허니문', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'),
('설악산 등반', '설악산의 아름다운 자연을 만끽하는 트레킹', 150000, '1박 2일', '설악산', '국내여행', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'),
('베트남 다낭', '베트남 다낭의 아름다운 해변과 맛있는 음식', 480000, '3박 4일', '다낭, 베트남', '해외여행', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4');

-- 3. 샘플 공지사항 삽입
INSERT INTO notices (title, content) VALUES
('여행 예약 시 주의사항', '여행 예약 시 반드시 여권 유효기간을 확인해주세요. 해외여행의 경우 출발일 기준 6개월 이상 여권이 유효해야 합니다.'),
('코로나19 방역 지침', '모든 여행 상품은 정부 방역 지침에 따라 진행됩니다. 마스크 착용 및 거리두기를 준수해주세요.'),
('여름 성수기 할인 이벤트', '7-8월 여름 성수기 패키지 10% 할인! 선착순 100명까지!'),
('가을 단풍 여행 신상품 출시', '올 가을 가장 아름다운 단풍 명소들을 엄선한 특별 패키지가 출시되었습니다.');

-- 4. 샘플 후기 삽입 (테스트 사용자 ID가 필요하므로 실제 사용자 생성 후 실행)
-- 이 부분은 실제 사용자가 생성된 후에 실행하세요
/*
INSERT INTO reviews (package_id, user_id, rating, comment) VALUES
((SELECT id FROM packages WHERE title = '제주도 3박 4일' LIMIT 1), 
 (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1), 
 5, '정말 좋은 여행이었습니다! 제주도의 아름다운 자연을 만끽할 수 있었어요.'),
((SELECT id FROM packages WHERE title = '부산 바다 여행' LIMIT 1), 
 (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1), 
 4, '부산 해변이 정말 예뻤어요. 음식도 맛있고 좋은 추억 만들었습니다.');
*/
