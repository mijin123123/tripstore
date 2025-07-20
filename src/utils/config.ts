import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  clientUrl: string;
  supabase: {
    url: string;
    anonKey: string;
  };
  jwtSecret: string;
  logLevel: string;
  apiRateLimit: number;
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-key',
  logLevel: process.env.LOG_LEVEL || 'info',
  apiRateLimit: parseInt(process.env.API_RATE_LIMIT || '100', 10),
};

// 필수 환경 변수 검증
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];

if (config.nodeEnv === 'production') {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });
}
