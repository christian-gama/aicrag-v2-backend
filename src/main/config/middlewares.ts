import { Express } from 'express'
import { bodyParser, urlEncoded, cors } from '../middlewares'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(urlEncoded)
  app.use(cors)
}
