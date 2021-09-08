import { Express } from 'express'
import authenticationRoutes from '../routes/authentication-routes'

export default (app: Express): void => {
  app.use('/api/auth', authenticationRoutes)
}
