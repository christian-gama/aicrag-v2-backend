import { bodyParser, cookieParser, cors, urlEncoded } from '../middlewares'

import { Express } from 'express'

export default (app: Express): void => {
  app.use(cookieParser)
  app.use(bodyParser)
  app.use(urlEncoded)
  app.use(cors)
}
