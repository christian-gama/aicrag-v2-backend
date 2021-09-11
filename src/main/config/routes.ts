import authenticationRoutes from '../routes/authentication-routes'

import { Express } from 'express'

export default (app: Express): void => {
  app.use('/api/auth', authenticationRoutes)
}
