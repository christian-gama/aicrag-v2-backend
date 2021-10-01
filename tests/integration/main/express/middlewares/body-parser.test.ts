import app from '@/main/express/config/app'

import request from 'supertest'

describe('bodyParser', () => {
  beforeAll(() => {
    app.post('/use_body_parser', (req, res) => {
      res.send(req.body)
    })
  })

  const agent = request.agent(app)

  it('should parse body', async () => {
    expect.assertions(0)

    await agent
      .post('/use_body_parser')
      .send({ name: 'any_name' })
      .then(() => expect({ name: 'any_name' }))
  })
})
