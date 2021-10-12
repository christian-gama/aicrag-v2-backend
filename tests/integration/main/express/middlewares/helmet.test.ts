import app from '@/main/express/config/app'

import request from 'supertest'

describe('helmet', () => {
  beforeAll(() => {
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
