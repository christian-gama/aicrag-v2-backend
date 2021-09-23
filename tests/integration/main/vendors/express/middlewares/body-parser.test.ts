import app from '@/main/vendors/express/config/app'

import request from 'supertest'

describe('BodyParser', () => {
  beforeEach(() => {
    app.post('/use_body_parser', (req, res) => {
      res.send(req.body)
    })
  })

  const agent = request.agent(app)

  it('Should parse body', async () => {
    await agent.post('/use_body_parser').send({ name: 'any_name' }).expect({ name: 'any_name' })
  })
})
