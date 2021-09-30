import { bodyParser, cookieParser, cors, urlEncoded } from '../middlewares'

import { Express } from 'express'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cookieParser)
  app.use(cors)
  app.use(urlEncoded)
}
