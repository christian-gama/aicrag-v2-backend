import { environment } from '@/main/config/environment'

import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  max: environment.SERVER.NODE_ENV === 'test' ? 0 : 120,
  message: 'Too many requests from this IP, please try again in an hour.',
  windowMs: 60 * 1000
})

export const signUpLimiter = rateLimit({
  max: environment.SERVER.NODE_ENV === 'test' ? 0 : 5,
  message: 'Too many requests from this IP, please try again in an hour.',
  windowMs: 60 * 60 * 1000
})

export const loginLimiter = rateLimit({
  max: environment.SERVER.NODE_ENV === 'test' ? 0 : 5,
  message: 'Too many requests from this IP, please try again in an hour.',
  windowMs: 30 * 60 * 1000
})

export const emailLimiter = rateLimit({
  max: environment.SERVER.NODE_ENV === 'test' ? 0 : 10,
  message: 'Too many requests from this IP, please try again in an hour.',
  windowMs: 60 * 60 * 1000
})
