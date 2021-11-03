import App from '@/main/express/config/app'
import assert from 'assert'
import { Express } from 'express'
import request from 'supertest'

describe('cors', () => {
  let app: Express

  beforeAll(async () => {
    app = await App.setup()

    app.post('/test_cors', (req, res) => {
      res.send()
    })
  })

  it('should enable cors', async () => {
    await request(app)
      .patch('/test_cors')
      .expect('access-control-allow-origin', 'http://localhost:3000')
      .expect('access-control-allow-credentials', 'true')
  })

  it('should return an error if tries invalid method', async () => {
    await request(app)
      .put('/test_cors')
      .then((response) => assert(response.error))
  })
})
