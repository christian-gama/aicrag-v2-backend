import app from '@/main/vendors/express/config/app'

import request from 'supertest'

describe('cors', () => {
  beforeAll(() => {
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
