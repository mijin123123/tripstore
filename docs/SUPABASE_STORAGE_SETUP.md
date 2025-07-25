# Supabase Storage 버킷 설정 가이드

## 방법 1: Supabase 대시보드에서 수동 생성 (추천)

1. **Supabase 대시보드에 로그인**
   - https://app.supabase.com 접속
   - 프로젝트 선택

2. **Storage 섹션으로 이동**
   - 왼쪽 메뉴에서 "Storage" 클릭

3. **새 버킷 생성**
   - "Create bucket" 버튼 클릭
   - 버킷 이름: `hero-images`
   - Public bucket: `체크 ✓`
   - "Save" 클릭

4. **버킷 정책 설정**
   - 생성된 `hero-images` 버킷 클릭
   - "Policies" 탭 클릭
   - "New policy" 버튼 클릭
   - 다음 정책들을 각각 생성:

   **Policy 1: Public Read Access**
   ```
   Policy name: Public Access
   Allowed operation: SELECT
   Target roles: public
   USING expression: bucket_id = 'hero-images'
   ```

   **Policy 2: Admin Upload Access**
   ```
   Policy name: Admin Upload
   Allowed operation: INSERT
   Target roles: authenticated
   WITH CHECK expression: bucket_id = 'hero-images'
   ```

   **Policy 3: Admin Update Access**
   ```
   Policy name: Admin Update
   Allowed operation: UPDATE
   Target roles: authenticated
   USING expression: bucket_id = 'hero-images'
   ```

   **Policy 4: Admin Delete Access**
   ```
   Policy name: Admin Delete
   Allowed operation: DELETE
   Target roles: authenticated
   USING expression: bucket_id = 'hero-images'
   ```

## 방법 2: SQL Editor 사용

1. Supabase 대시보드에서 "SQL Editor" 클릭
2. 다음 SQL 실행:

```sql
-- 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS 정책 설정
CREATE POLICY "Public Access for hero-images" ON storage.objects 
FOR SELECT USING (bucket_id = 'hero-images');

CREATE POLICY "Admin can upload hero images" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin can update hero images" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin can delete hero images" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
);
```

## 방법 3: 자동 생성 (코드에서 처리)

현재 코드에서 버킷이 없을 경우 자동으로 생성하도록 구현되어 있습니다.
이미지 업로드 시 자동으로 버킷이 생성됩니다.

## 확인 방법

버킷이 성공적으로 생성되었는지 확인:
1. Supabase 대시보드 > Storage
2. `hero-images` 버킷이 표시되는지 확인
3. 버킷이 "Public" 상태인지 확인

## 문제 해결

- **권한 오류**: 관리자 권한으로 로그인했는지 확인
- **정책 오류**: RLS 정책이 올바르게 설정되었는지 확인
- **네트워크 오류**: 인터넷 연결 및 Supabase 서비스 상태 확인
