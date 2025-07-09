import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

// 서버리스 환경에서 WebSocket 비활성화
neonConfig.webSocketConstructor = undefined;

const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
export const db = drizzle(pool, { schema });

export * from './schema';
