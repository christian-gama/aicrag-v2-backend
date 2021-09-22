
import middlewares from './middlewares'
import routes from './routes'
import schedulers from '@/main/config/schedulers'

import express from 'express'
import engine from './engine'

const app = express()

middlewares(app)
engine(app)
routes(app)
schedulers()

export default app
