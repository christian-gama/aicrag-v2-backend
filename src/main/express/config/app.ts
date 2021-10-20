import { environment } from '@/main/config/environment'
import schedulers from '@/main/config/schedulers'
import setupApolloServer from '@/main/graphql/config/apollo-server'

import engine from './engine'
import middlewares from './middlewares'
import routes from './routes'

import express, { Express } from 'express'

export const setupApp = async (): Promise<Express> => {
  const app = express()

  if (environment.SERVER.NODE_ENV !== 'test') {
    await setupApolloServer(app)
  }

  middlewares(app)
  engine(app)
  routes(app)
  schedulers()

  return app
}
