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

// 모델이 이미 존재하는 경우 재사용 (Next.js의 Hot Reload 대응)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
