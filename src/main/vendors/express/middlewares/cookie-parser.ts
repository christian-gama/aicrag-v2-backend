import { environment } from '../../../config/environment'

import _cookieParser from 'cookie-parser'

export const cookieParser = _cookieParser(environment.COOKIES.SECRET)
