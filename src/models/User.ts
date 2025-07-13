import mongoose, { Schema } from 'mongoose';

/**
 * 사용자 스키마 정의
 */
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다.']
  },
  name: {
    type: String,
    required: [true, '이름은 필수입니다.'],
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
  },
  last_login: {
    type: Date
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// 비밀번호 필드는 항상 선택 해제
UserSchema.set('toJSON', {
  transform: function(doc, ret: any) {
    delete ret.password;
    return ret;
  }
});

/**
 * User 모델을 가져오거나 생성합니다.
 * 이 방식은 Next.js의 개발 환경에서 모델이 여러 번 컴파일되는 문제를 방지합니다.
 */
let User;

try {
  // 기존 모델이 있으면 재사용
  User = mongoose.model('User');
} catch (error) {
  // 모델이 없으면 새로 생성
  User = mongoose.model('User', UserSchema);
}

export default User;
