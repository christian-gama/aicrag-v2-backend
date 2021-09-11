import { Express } from 'express'
import { bodyParser, urlEncoded, cors } from '../middlewares'
import cookieParser from '../middlewares/cookie-parser'

export default (app: Express): void => {
  app.use(cookieParser)
  app.use(bodyParser)
  app.use(urlEncoded)
  app.use(cors)
}
