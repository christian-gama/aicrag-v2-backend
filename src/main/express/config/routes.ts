import { environment } from '@/main/config/environment'

import { notFound, errorRequestHandler } from '../middlewares'
import { isLoggedInMiddleware } from '../routes'
import accountRoutes from '../routes/account-routes'
import loginRoutes from '../routes/login-routes'
import mailerRoutes from '../routes/mailer-routes'
import signupRoutes from '../routes/signup-routes'
import tokenRoutes from '../routes/token-routes'

import { Express } from 'express'

export default (app: Express): void => {
  app.use(isLoggedInMiddleware)
  app.use('/api/v1/account', accountRoutes)
  app.use('/api/v1/login', loginRoutes)
  app.use('/api/v1/mailer', mailerRoutes)
  app.use('/api/v1/signup', signupRoutes)
  app.use('/api/v1/token', tokenRoutes)

  if (environment.SERVER.NODE_ENV !== 'test') {
    app.all('*', notFound)
    app.use(errorRequestHandler)
  }
}
