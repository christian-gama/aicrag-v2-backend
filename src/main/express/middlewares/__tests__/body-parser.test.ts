import App from '@/main/express/config/app'
import { Express } from 'express'
import request from 'supertest'

describe('bodyParser', () => {
  let app: Express

  beforeAll(async () => {
    app = await App.setup()

    app.post('/use_body_parser', (req, res) => {
      res.send(req.body)
    })
  })

  it('should parse body', async () => {
    const result = await request(app).post('/use_body_parser').send({ name: 'any_name' })

    expect(result.body.name).toBe('any_name')
  })
})
