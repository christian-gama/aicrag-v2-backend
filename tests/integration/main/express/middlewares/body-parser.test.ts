import { setupApp } from '@/main/express/config/app'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('bodyParser', () => {
  beforeAll(async () => {
    app = await setupApp()
    app.post('/use_body_parser', (req, res) => {
      res.send(req.body)
    })
  })

  it('should parse body', async () => {
    expect.assertions(0)

    await request(app)
      .post('/use_body_parser')
      .send({ name: 'any_name' })
      .expect({ name: 'any_name' })
  })
})
