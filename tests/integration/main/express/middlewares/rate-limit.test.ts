import app from '@/main/express/config/app'

import assert from 'assert'
import rateLimit from 'express-rate-limit'
import request from 'supertest'

describe('rateLimit', () => {
  beforeAll(() => {
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
    expect.assertions(0)

    await request(app).post('/test_limiter').expect('X-RateLimit-Limit', '123')
  })

  it('should block after 3 attempts', async () => {
    expect.assertions(0)

    await request(app).post('/test_block').expect(200)
    await request(app).post('/test_block').expect(200)
    await request(app).post('/test_block').expect(200)
    await request(app)
      .post('/test_block')
      .expect(429)
      .then((response) => assert(response.text === 'Any message'))
  })
})
