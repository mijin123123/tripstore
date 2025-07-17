export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드에서는 현재 도메인을 사용
    return window.location.origin;
  }
  
  // 서버 사이드에서는 환경변수 또는 기본값 사용
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://mellifluous-druid-c3d6b0.netlify.app';
};

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  // 클라이언트 사이드에서는 상대 경로를 사용 (가장 안전한 방법)
  const url = endpoint;
  
  console.log('API 호출:', url, options);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  console.log('API 응답:', response.status, response.statusText);
  
  return response;
};
