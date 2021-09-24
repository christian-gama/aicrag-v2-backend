import { notFound, errorRequestHandler } from '../middlewares'
import { isLoggedInMiddleware } from '../routes'
import accountRoutes from '../routes/account-routes'
import loginRoutes from '../routes/login-routes'
import signupRoutes from '../routes/signup-routes'
import tokenRoutes from '../routes/token-routes'

import { Express } from 'express'

export default (app: Express): void => {
  if (process.env.NODE_ENV !== 'test') {
    app.use(isLoggedInMiddleware)
    app.use('/api/v1/account', accountRoutes)
    app.use('/api/v1/login', loginRoutes)
    app.use('/api/v1/signup', signupRoutes)
    app.use('/api/v1/token', tokenRoutes)
    app.all('*', notFound)
    app.use(errorRequestHandler)
  }
}
