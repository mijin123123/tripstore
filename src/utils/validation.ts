import Joi from 'joi';

// 공통 검증 스키마
export const commonSchemas = {
  id: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
  phone: Joi.string().pattern(new RegExp('^[0-9]{10,11}$')).required(),
  name: Joi.string().min(2).max(50).required(),
  date: Joi.date().iso().required(),
  price: Joi.number().positive().required(),
};

// 사용자 관련 검증 스키마
export const userSchemas = {
  register: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    name: commonSchemas.name,
    phone: commonSchemas.phone,
  }),

  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    name: commonSchemas.name.optional(),
    phone: commonSchemas.phone.optional(),
  }),
};

// 여행 패키지 관련 검증 스키마
export const packageSchemas = {
  create: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(50).max(2000).required(),
    destination: Joi.string().min(2).max(100).required(),
    duration: Joi.number().integer().min(1).max(365).required(),
    price: commonSchemas.price,
    maxParticipants: Joi.number().integer().min(1).max(50).required(),
    startDate: commonSchemas.date,
    endDate: commonSchemas.date,
    images: Joi.array().items(Joi.string().uri()).max(10).optional(),
    itinerary: Joi.array().items(
      Joi.object({
        day: Joi.number().integer().min(1).required(),
        title: Joi.string().min(5).max(100).required(),
        description: Joi.string().min(10).max(500).required(),
        activities: Joi.array().items(Joi.string().max(100)).optional(),
      })
    ).optional(),
  }),

  update: Joi.object({
    title: Joi.string().min(5).max(200).optional(),
    description: Joi.string().min(50).max(2000).optional(),
    destination: Joi.string().min(2).max(100).optional(),
    duration: Joi.number().integer().min(1).max(365).optional(),
    price: commonSchemas.price.optional(),
    maxParticipants: Joi.number().integer().min(1).max(50).optional(),
    startDate: commonSchemas.date.optional(),
    endDate: commonSchemas.date.optional(),
    images: Joi.array().items(Joi.string().uri()).max(10).optional(),
    itinerary: Joi.array().items(
      Joi.object({
        day: Joi.number().integer().min(1).required(),
        title: Joi.string().min(5).max(100).required(),
        description: Joi.string().min(10).max(500).required(),
        activities: Joi.array().items(Joi.string().max(100)).optional(),
      })
    ).optional(),
  }),
};

// 예약 관련 검증 스키마
export const bookingSchemas = {
  create: Joi.object({
    packageId: commonSchemas.id,
    participants: Joi.number().integer().min(1).max(10).required(),
    specialRequests: Joi.string().max(500).optional(),
    emergencyContact: Joi.object({
      name: commonSchemas.name,
      phone: commonSchemas.phone,
      relationship: Joi.string().max(50).required(),
    }).required(),
  }),

  update: Joi.object({
    participants: Joi.number().integer().min(1).max(10).optional(),
    specialRequests: Joi.string().max(500).optional(),
    emergencyContact: Joi.object({
      name: commonSchemas.name,
      phone: commonSchemas.phone,
      relationship: Joi.string().max(50).required(),
    }).optional(),
  }),
};

// 검색 관련 검증 스키마
export const searchSchemas = {
  packages: Joi.object({
    destination: Joi.string().max(100).optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    duration: Joi.number().integer().min(1).max(365).optional(),
    startDate: commonSchemas.date.optional(),
    endDate: commonSchemas.date.optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    sortBy: Joi.string().valid('price', 'duration', 'startDate', 'createdAt').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
  }),
};
