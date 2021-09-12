import authenticationRoutes from '../routes/authentication-routes'
import { errorHandler } from '../middlewares/error-handler'
import { notFound } from '../middlewares/not-found'

import { Express } from 'express'

export default (app: Express): void => {
  if (process.env.NODE_ENV !== 'test') {
    app.use('/api/auth', authenticationRoutes)
    app.all('*', notFound)
    app.use(errorHandler)
  }
}
