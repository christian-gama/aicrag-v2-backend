import schedulers from '@/main/config/schedulers'
import setupApolloServer from '@/main/graphql/config/apollo-server'

import engine from './engine'
import middlewares from './middlewares'
import routes from './routes'

import express from 'express'

const app = express()

setupApolloServer(app)
middlewares(app)
engine(app)
routes(app)
schedulers()

export default app
