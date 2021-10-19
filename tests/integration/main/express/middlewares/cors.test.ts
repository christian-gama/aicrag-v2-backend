import { setupApp } from '@/main/express/config/app'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('cors', () => {
  beforeAll(async () => {
    app = await setupApp()

    app.post('/test_cors', (req, res) => {
      res.send()
    })
  })

  it('should enable cors', async () => {
    expect.assertions(0)

    await request(app)
      .post('/test_cors')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-origin', '*')
  })
})
