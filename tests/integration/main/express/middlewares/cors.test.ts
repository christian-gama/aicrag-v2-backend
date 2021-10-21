import { setupApp } from '@/main/express/config/app'

import assert from 'assert'
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
      .patch('/test_cors')
      .expect('access-control-allow-origin', 'http://localhost:3000')
      .expect('access-control-allow-credentials', 'true')
  })

  it('should return an error if tries invalid method', async () => {
    expect.assertions(0)

    await request(app)
      .put('/test_cors')
      .then((response) => assert(response.error))
  })
})
