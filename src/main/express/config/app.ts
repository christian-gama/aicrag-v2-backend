import schedulers from '@/main/config/schedulers'
import setupApolloServer from '@/main/graphql/config/apollo-server'

import engine from './engine'
import middlewares from './middlewares'
import routes from './routes'

import express, { Express } from 'express'

export const setupApp = async (): Promise<Express> => {
  const app = express()

  middlewares(app)
  engine(app)
  routes(app)
  schedulers()
  const server = setupApolloServer()
  await server.start()
  server.applyMiddleware({ app })

  return app
}
