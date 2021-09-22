import { Express } from 'express'
import path from 'path'

export default (app: Express): void => {
  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname, '../../../services/mailer/templates'))
}
