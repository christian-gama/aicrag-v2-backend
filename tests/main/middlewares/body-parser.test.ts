import request from 'supertest'
import app from '@/main/config/app'

describe('BodyParser', () => {
  it('Should parse body', async () => {
    app.post('/use_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/use_body_parser')
      .send({ name: 'any_name' })
      .expect({ name: 'any_name' })
  })
})
