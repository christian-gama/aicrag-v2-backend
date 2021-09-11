import _cookieParser from 'cookie-parser'
import { env } from '../config/env'

export const cookieParser = _cookieParser(env.COOKIE_SECRET)
