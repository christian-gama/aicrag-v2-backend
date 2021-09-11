import cookieParser from 'cookie-parser'
import { env } from '../config/env'

const _cookieParser = cookieParser(env.COOKIE_SECRET)

export default _cookieParser
