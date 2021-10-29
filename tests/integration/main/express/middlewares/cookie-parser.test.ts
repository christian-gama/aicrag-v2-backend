import App from '@/main/express/config/app'

import { Express } from 'express'
import request from 'supertest'

let agent: request.SuperAgentTest

export default (): void =>
  describe('cookieParser', () => {
    let app: Express

    beforeAll(async () => {
      app = await App.setup()
      agent = request.agent(app)

      app.get('/save_cookie', (req, res) => {
        res.cookie('any_cookie', 'any_value')
        res.send()
      })

      app.get('/send_cookie', (req, res) => {
        if (req.cookies.any_cookie) res.send(req.cookies.any_cookie)
        else res.send('No cookies')
      })
    })

    it('should save cookies', async () => {
      const result = await agent.get('/save_cookie')

      expect(result.header['set-cookie']).toBeDefined()
    })

    it('should send cookies', async () => {
      const result = await agent.get('/send_cookie')

      expect(result.text).toBe('any_value')
    })
  })
