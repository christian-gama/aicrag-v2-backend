import middlewares from './middlewares'
import routes from './routes'

import express from 'express'

const app = express()

middlewares(app)
routes(app)

export default app
