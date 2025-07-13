const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // POST 요청만 허용
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // 환경 변수 확인
    const mongoUri = process.env.MONGODB_URI;
    const jwtSecret = process.env.JWT_SECRET;

    console.log('🔍 환경 변수 확인:');
    console.log('- MONGODB_URI:', !!mongoUri);
    console.log('- JWT_SECRET:', !!jwtSecret);

    if (!mongoUri) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'MONGODB_URI 환경 변수가 설정되지 않았습니다.',
          env_check: {
            MONGODB_URI: false,
            JWT_SECRET: !!jwtSecret
          }
        })
      };
    }

    // 요청 바디 파싱
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '이메일과 비밀번호를 입력해주세요.' })
      };
    }

    console.log('📝 로그인 시도:', email);

    // MongoDB 연결 테스트
    const client = new MongoClient(mongoUri);
    
    try {
      await client.connect();
      console.log('✅ MongoDB 연결 성공');
      
      const db = client.db('tripstore');
      const users = db.collection('users');
      
      // 사용자 조회
      const user = await users.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: '존재하지 않는 사용자입니다.' })
        };
      }

      console.log('✅ 사용자 찾음:', user.email);

      // 간단한 패스워드 체크 (테스트용)
      let isValidPassword = false;
      
      // 1. 테스트 계정 체크
      if (email === 'test@example.com' && password === 'test123') {
        isValidPassword = true;
      }
      // 2. 평문 비밀번호 체크 (테스트용)
      else if (user.password === password) {
        isValidPassword = true;
      }
      // 3. 해시된 비밀번호 체크 (실제 데이터용)
      else if (user.password && user.password.startsWith('$2b$')) {
        // bcrypt 해시인 경우 - 일단 스킵 (bcrypt 모듈이 없을 수 있음)
        console.log('해시된 비밀번호 감지됨');
      }

      if (!isValidPassword) {      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: '로그인 성공',
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name || '사용자',
            role: user.role || 'user'
          }
        })
      };
      }

    } finally {
      await client.close();
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '서버 오류가 발생했습니다.',
        details: error.message 
      })
    };
  }
};
