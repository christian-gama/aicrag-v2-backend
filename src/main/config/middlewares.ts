import { Express } from 'express'
import { bodyParser, urlEncoded, cors, cookieParser } from '../middlewares'

export default (app: Express): void => {
  app.use(cookieParser)
  app.use(bodyParser)
  app.use(urlEncoded)
  app.use(cors)
}
