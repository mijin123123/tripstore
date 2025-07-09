const { Pool } = require('@neondatabase/serverless');

async function checkPackages() {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  
  try {
    const result = await pool.query('SELECT id, title FROM packages LIMIT 5');
    console.log('패키지 목록:');
    result.rows.forEach(row => {
      console.log(`ID: ${row.id}, Title: ${row.title}`);
    });
  } catch (err) {
    console.error('오류:', err);
  }
}

checkPackages();
