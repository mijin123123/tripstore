"use strict";

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB 연결
async function connectMongoDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10
    });
    console.log('✅ MongoDB에 연결되었습니다.');
  } catch (error) {
    console.error('❌ MongoDB 연결 오류:', error);
    process.exit(1);
  }
}

// 사용자 스키마 정의
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// 모델 생성
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// 관리자 계정 생성
async function createAdminUser() {
  try {
    const adminEmail = 'sonchanmin89@gmail.com';
    const adminPassword = 'aszx1212';
    const adminName = '관리자';
    
    // 이미 존재하는 관리자인지 확인
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`🔄 관리자 계정(${adminEmail})이 이미 존재합니다.`);
      
      // 기존 관리자가 admin 역할이 아니면 업데이트
      if (existingAdmin.role !== 'admin') {
        await User.updateOne(
          { email: adminEmail },
          { $set: { role: 'admin' } }
        );
        console.log(`✅ ${adminEmail} 계정을 관리자 권한으로 업데이트했습니다.`);
      }
      
      process.exit(0);
    }
    
    // 비밀번호 해싱
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    
    // 관리자 계정 생성
    const adminUser = new User({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'admin'
    });
    
    await adminUser.save();
    console.log(`✅ 관리자 계정(${adminEmail})이 성공적으로 생성되었습니다.`);
  } catch (error) {
    console.error('❌ 관리자 계정 생성 중 오류 발생:', error);
  } finally {
    mongoose.connection.close();
  }
}

// 실행
(async () => {
  await connectMongoDB();
  await createAdminUser();
  console.log('✅ 작업이 완료되었습니다.');
  process.exit(0);
})();
