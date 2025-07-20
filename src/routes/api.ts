import express from 'express';
import { Request, Response } from 'express';
import { supabaseService } from '../services/supabaseService';
import { successResponse, errorResponse } from '../utils/response';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { validateBody, validateQuery, validateParams } from '../middleware/validation';
import {
  userSchemas,
  packageSchemas,
  bookingSchemas,
  searchSchemas,
  commonSchemas
} from '../utils/validation';
import Joi from 'joi';
import { logger } from '../utils/logger';

const router = express.Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json(successResponse('API is running'));
});

// === 인증 관련 라우트 ===

// 회원가입
router.post('/auth/register',
  validateBody(userSchemas.register),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, phone } = req.body;

    const userData = await supabaseService.signUp(email, password, {
      name,
      phone,
    });

    res.status(201).json(successResponse('User registered successfully', userData));
  })
);

// 로그인
router.post('/auth/login',
  validateBody(userSchemas.login),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const authData = await supabaseService.signIn(email, password);

    res.json(successResponse('Login successful', authData));
  })
);

// 로그아웃
router.post('/auth/logout',
  asyncHandler(async (req: Request, res: Response) => {
    await supabaseService.signOut();
    res.json(successResponse('Logout successful'));
  })
);

// === 여행 패키지 관련 라우트 ===

// 패키지 목록 조회
router.get('/packages',
  validateQuery(searchSchemas.packages),
  asyncHandler(async (req: Request, res: Response) => {
    const filters = req.query;
    const packages = await supabaseService.getPackages(filters);

    res.json(successResponse('Packages retrieved successfully', packages));
  })
);

// 패키지 상세 조회
router.get('/packages/:id',
  validateParams(Joi.object({ id: commonSchemas.id })),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw createError('Package ID is required', 400, 'MISSING_PACKAGE_ID');
    }

    const packageData = await supabaseService.getPackageById(id);

    if (!packageData) {
      throw createError('Package not found', 404, 'PACKAGE_NOT_FOUND');
    }

    res.json(successResponse('Package retrieved successfully', packageData));
  })
);

// 패키지 생성 (관리자용)
router.post('/packages',
  validateBody(packageSchemas.create),
  asyncHandler(async (req: Request, res: Response) => {
    const packageData = req.body;

    const newPackage = await supabaseService.createPackage({
      ...packageData,
      current_participants: 0,
      status: 'active',
    });

    res.status(201).json(successResponse('Package created successfully', newPackage));
  })
);

// 패키지 수정 (관리자용)
router.put('/packages/:id',
  validateParams(Joi.object({ id: commonSchemas.id })),
  validateBody(packageSchemas.update),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      throw createError('Package ID is required', 400, 'MISSING_PACKAGE_ID');
    }

    const updatedPackage = await supabaseService.updatePackage(id, updateData);

    res.json(successResponse('Package updated successfully', updatedPackage));
  })
);

// 패키지 삭제 (관리자용)
router.delete('/packages/:id',
  validateParams(Joi.object({ id: commonSchemas.id })),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw createError('Package ID is required', 400, 'MISSING_PACKAGE_ID');
    }

    await supabaseService.deletePackage(id);

    res.json(successResponse('Package deleted successfully'));
  })
);

// === 예약 관련 라우트 ===

// 예약 생성
router.post('/bookings',
  validateBody(bookingSchemas.create),
  asyncHandler(async (req: Request, res: Response) => {
    const { packageId, participants, specialRequests, emergencyContact } = req.body;

    // 패키지 정보 확인
    const packageData = await supabaseService.getPackageById(packageId);
    if (!packageData) {
      throw createError('Package not found', 404, 'PACKAGE_NOT_FOUND');
    }

    // 가용성 확인
    if (packageData.current_participants + participants > packageData.max_participants) {
      throw createError('Not enough available spots', 400, 'INSUFFICIENT_CAPACITY');
    }

    const totalPrice = packageData.price * participants;

    const bookingData = await supabaseService.createBooking({
      package_id: packageId,
      participants,
      total_price: totalPrice,
      status: 'pending',
      payment_status: 'pending',
      special_requests: specialRequests,
      emergency_contact: emergencyContact,
    });

    res.status(201).json(successResponse('Booking created successfully', bookingData));
  })
);

// 사용자 예약 목록 조회
router.get('/bookings/user/:userId',
  validateParams(Joi.object({ userId: commonSchemas.id })),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      throw createError('User ID is required', 400, 'MISSING_USER_ID');
    }

    const bookings = await supabaseService.getBookingsByUser(userId);

    res.json(successResponse('User bookings retrieved successfully', bookings));
  })
);

// 예약 수정
router.put('/bookings/:id',
  validateParams(Joi.object({ id: commonSchemas.id })),
  validateBody(bookingSchemas.update),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      throw createError('Booking ID is required', 400, 'MISSING_BOOKING_ID');
    }

    const updatedBooking = await supabaseService.updateBooking(id, updateData);

    res.json(successResponse('Booking updated successfully', updatedBooking));
  })
);

// === 기타 라우트 ===

// 인기 목적지 조회
router.get('/destinations/popular',
  asyncHandler(async (req: Request, res: Response) => {
    // 임시 데이터 반환 (실제로는 DB에서 인기 목적지를 조회)
    const popularDestinations = [
      { name: '파리', country: '프랑스', packageCount: 15 },
      { name: '도쿄', country: '일본', packageCount: 12 },
      { name: '런던', country: '영국', packageCount: 10 },
      { name: '뉴욕', country: '미국', packageCount: 8 },
      { name: '로마', country: '이탈리아', packageCount: 7 },
    ];

    res.json(successResponse('Popular destinations retrieved successfully', popularDestinations));
  })
);

// 검색 자동완성
router.get('/search/autocomplete',
  validateQuery(Joi.object({ q: Joi.string().min(1).required() })),
  asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query as { q: string };

    // 임시 데이터 반환 (실제로는 DB에서 검색)
    const suggestions = [
      '파리',
      '파타야',
      '도쿄',
      '런던',
      '로마'
    ].filter(item => item.toLowerCase().includes(q.toLowerCase()));

    res.json(successResponse('Search suggestions retrieved successfully', suggestions));
  })
);

// 에러 테스트용 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  router.get('/test-error', () => {
    throw createError('Test error', 500, 'TEST_ERROR');
  });
}

export default router;
