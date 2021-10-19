import { setupApp } from '@/main/express/config/app'

import { Express } from 'express'
import request from 'supertest'

let app: Express
let agent: request.SuperAgentTest

describe('cookieParser', () => {
  beforeAll(async () => {
    app = await setupApp()
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
    expect.assertions(0)

    await agent.get('/save_cookie').expect('set-cookie', 'any_cookie=any_value; Path=/')
  })

  it('should send cookies', async () => {
    expect.assertions(0)

    await agent.get('/send_cookie').expect('any_value')
  })
})
