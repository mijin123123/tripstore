# RLS 정책 문제 해결 가이드

## 1. 원인

Supabase의 Row Level Security(RLS) 정책에서 무한 재귀 문제가 발생했습니다. 이 문제는 정책 내에서 동일한 테이블을 쿼리할 때 발생할 수 있습니다.

오류 메시지:
```
infinite recursion detected in policy for relation "users"
```

## 2. 해결 방법

### 2.1. 단순한 RLS 정책 적용

가장 효과적인 해결책은 RLS 정책을 단순화하는 것입니다:

```sql
-- Supabase SQL 에디터에서 실행하세요
-- 기존 정책 삭제
DROP POLICY IF EXISTS "사용자는 자신의 데이터만 볼 수 있음" ON public.users;
DROP POLICY IF EXISTS "사용자는 자신의 데이터만 업데이트할 수 있음" ON public.users;
DROP POLICY IF EXISTS "관리자는 모든 사용자 데이터를 볼 수 있음" ON public.users;
DROP POLICY IF EXISTS "관리자는 모든 사용자 데이터를 업데이트할 수 있음" ON public.users;
DROP POLICY IF EXISTS "모든 사용자는 자신의 데이터에 접근할 수 있음" ON public.users;
DROP POLICY IF EXISTS "기본 정책" ON public.users;

-- 단순한 정책 생성: 인증된 사용자는 모든 데이터를 볼 수 있지만 자신의 데이터만 수정 가능
CREATE POLICY "기본 정책" ON public.users
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.uid() = id);
```

### 2.2. 관리자 권한 설정

관리자 권한은 애플리케이션 코드 내에서 처리하는 것이 더 안전합니다:

```sql
-- 관리자 플래그 설정
UPDATE public.users SET is_admin = true WHERE email = 'sosing899@gmail.com';
```

### 2.3. 서버 측 API 활용

복잡한 권한 관리는 서비스 키를 사용하는 서버 측 API를 통해 처리하세요:

```javascript
// 서버 측 API (src/app/api/admin/users/route.ts)
import { createClient } from '@supabase/supabase-js'

export async function GET(request) {
  // 서비스 키로 클라이언트 생성 (RLS 우회)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
  
  // 관리자 확인
  const session = await supabase.auth.getSession()
  const userId = session?.data?.session?.user?.id
  
  if (!userId) {
    return new Response(JSON.stringify({ error: '인증 필요' }), { status: 401 })
  }
  
  // 관리자 확인
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', userId)
    .single()
  
  if (!userData?.is_admin) {
    return new Response(JSON.stringify({ error: '권한 없음' }), { status: 403 })
  }
  
  // 관리자 확인 후 사용자 목록 반환
  const { data: users } = await supabase
    .from('users')
    .select('*')
  
  return new Response(JSON.stringify({ users }))
}
```

## 3. 프로젝트 적용 방법

1. database/triggers.sql 파일의 내용을 Supabase SQL 에디터에서 실행하세요
2. 트리거 기능을 테스트하여 Auth 사용자가 users 테이블에 자동으로 추가되는지 확인하세요
3. 기존 사용자 동기화를 위해 scripts/sync-auth-users.js 스크립트를 실행하세요
