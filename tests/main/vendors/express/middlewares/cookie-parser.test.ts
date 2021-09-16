import app from '@/main/vendors/express/config/app'

import request from 'supertest'

describe('CookieParser', () => {
  beforeEach(() => {
    app.get('/save_cookie', (req, res) => {
      res.cookie('any_cookie', 'any_value')
      res.send()
    })

    app.get('/send_cookie', (req, res) => {
      if (req.cookies.any_cookie) res.send(req.cookies.any_cookie)
      else res.send('No cookies')
    })
  })

  const agent = request.agent(app)

  it('Should save cookies', async () => {
    await agent.get('/save_cookie').expect('set-cookie', 'any_cookie=any_value; Path=/')
  })

  it('Should send cookies', async () => {
    await agent.get('/send_cookie').expect('any_value')
  })
})
