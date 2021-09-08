import { Express } from 'express'
import { bodyParser, urlEncoded } from '../middlewares'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(urlEncoded)
}
