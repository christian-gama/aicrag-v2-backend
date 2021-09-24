import schedulers from '@/main/config/schedulers'

import engine from './engine'
import middlewares from './middlewares'
import routes from './routes'

import express from 'express'

const app = express()

middlewares(app)
engine(app)
routes(app)
schedulers()

export default app
