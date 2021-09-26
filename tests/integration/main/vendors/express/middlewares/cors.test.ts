import app from '@/main/vendors/express/config/app'

import request from 'supertest'

describe('Cors', () => {
  beforeAll(() => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
  })

  it('Should enable cors', async () => {
    await request(app)
      .post('/test_cors')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-origin', '*')
  })
})
