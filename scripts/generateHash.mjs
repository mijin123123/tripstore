import bcrypt from 'bcryptjs';

const generateHashedPassword = async () => {
  const plainPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log('Hashed password:', hashedPassword);
  console.log('SQL to run:');
  console.log(`UPDATE admins SET password = '${hashedPassword}' WHERE email = 'sonchanmin89@gmail.com';`);
};

generateHashedPassword();
