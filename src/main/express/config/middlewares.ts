import {
  bodyParser,
  cookieParser,
  cors,
  emailLimiter,
  helmet,
  limiter,
  loginLimiter,
  signUpLimiter,
  urlEncoded
} from '../middlewares'

import { Express } from 'express'

export default (app: Express): void => {
  app.enable('trust proxy')
  app.disable('x-powered-by')
  app.use(bodyParser)
  app.use(cookieParser)
  app.use(cors)
  app.use(helmet)
  app.use(urlEncoded)
  app.use('/api/v1', limiter)
  app.use('/api/v1/login', loginLimiter)
  app.use('/api/v1/mailer', emailLimiter)
  app.use('/api/v1/signup', signUpLimiter)
}
