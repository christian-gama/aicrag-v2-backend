
import middlewares from './middlewares'
import routes from './routes'
import schedulers from './schedulers'

import express from 'express'

const app = express()

middlewares(app)
routes(app)
schedulers()

export default app
