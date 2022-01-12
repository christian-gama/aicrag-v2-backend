import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { Express } from 'express'
import request from 'supertest'

describe('helmet', () => {
  const env = process.env.NODE_ENV as 'production' | 'development'
  let app: Express

  afterAll(() => {
    environment.SERVER.NODE_ENV = env
  })

  beforeAll(async () => {
    app = await App.setup()

    app.post('/test_helmet', (req, res) => {
      res.send()
    })
  })

  it('should enable helmet', async () => {
    await request(app)
      .post('/test_helmet')
      .expect(
        'Content-Security-Policy',
        "default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests"
      )
  })
})
