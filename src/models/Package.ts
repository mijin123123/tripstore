import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: '올바른 URL 형식이 아닙니다'
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // createdAt, updatedAt 자동 생성
});

// 인덱스 설정
PackageSchema.index({ category: 1 });
PackageSchema.index({ destination: 1 });
PackageSchema.index({ price: 1 });
PackageSchema.index({ featured: 1 });

// 모델이 이미 존재하는지 확인하고 재사용
const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);

export default Package;
