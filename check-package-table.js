const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function checkPackageTable() {
  try {
    const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
    
    console.log('📋 packages 테이블 구조 확인...');
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'packages' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('현재 packages 테이블 컬럼:');
    columns.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`);
    });
    
    console.log('\n📊 packages 테이블 데이터 확인...');
    const data = await pool.query('SELECT id, title, category FROM packages LIMIT 5');
    console.log('기존 데이터:', data.rows);
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

checkPackageTable();
