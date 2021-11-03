import App from '@/main/express/config/app'
import { Express } from 'express'
import rateLimit from 'express-rate-limit'
import request from 'supertest'

describe('rateLimit', () => {
  let app: Express

  beforeAll(async () => {
    app = await App.setup()

    const block = rateLimit({
      max: 3,
      message: 'Any message',
      windowMs: 60 * 1000
    })

    const limiter = rateLimit({
      max: 123,
      windowMs: 60 * 1000
    })

    app.use('/test_block', block)
    app.use('/test_limiter', limiter)

    app.post('/test_block', (req, res) => {
      res.send()
    })

    app.post('/test_limiter', (req, res) => {
      res.send()
    })
  })

  it('should enable rateLimit', async () => {
    const result = await request(app).post('/test_limiter')

    expect(result.headers['x-ratelimit-limit']).toBe('123')
  })

  it('should block after 3 attempts', async () => {
    let result = await request(app).post('/test_block')

    expect(result.status).toBe(200)

    result = await request(app).post('/test_block')

    expect(result.status).toBe(200)

    result = await request(app).post('/test_block')

    expect(result.status).toBe(200)

    result = await request(app).post('/test_block')

    expect(result.status).toBe(429)
    expect(result.text).toBe('Any message')
  })
})
