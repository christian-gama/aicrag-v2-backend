import { notFound, errorRequestHandler } from '../middlewares'
import authenticationRoutes from '../routes/authentication-routes'

import { Express } from 'express'

export default (app: Express): void => {
  if (process.env.NODE_ENV !== 'test') {
    app.use('/api/auth', authenticationRoutes)
    app.all('*', notFound)
    app.use(errorRequestHandler)
  }
}
