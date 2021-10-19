import { setupApp } from '@/main/express/config/app'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('helmet', () => {
  beforeAll(async () => {
    app = await setupApp()

    app.post('/test_helmet', (req, res) => {
      res.send()
    })
  })

  it('should enable helmet', async () => {
    expect.assertions(0)

    await request(app)
      .post('/test_helmet')
      .expect(
        'Content-Security-Policy',
        "default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests"
      )
  })
})
