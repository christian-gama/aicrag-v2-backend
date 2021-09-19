
import middlewares from './middlewares'
import routes from './routes'
import schedulers from '@/main/config/schedulers'

import express from 'express'

const app = express()

middlewares(app)
routes(app)
schedulers()

export default app