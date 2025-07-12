// 임시 파일: MongoDB로 이전하면서 이전 Supabase 참조를 유지하기 위한 더미 파일

// 빌드 시 오류 방지용 더미 함수
export function createClient() {
  console.warn('⚠️ Supabase는 더 이상 사용되지 않습니다. MongoDB로 이전했습니다.');
  return {
    auth: {
      getSession: () => ({ data: { session: null }, error: new Error('Supabase 사용 중지') }),
      getUser: () => ({ data: { user: null }, error: new Error('Supabase 사용 중지') }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({ data: [], error: new Error('Supabase 사용 중지') }),
      insert: () => ({ data: null, error: new Error('Supabase 사용 중지') }),
      update: () => ({ data: null, error: new Error('Supabase 사용 중지') }),
      delete: () => ({ data: null, error: new Error('Supabase 사용 중지') })
    })
  };
}
