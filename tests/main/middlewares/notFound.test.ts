import { adaptRoutes } from '@/main/adapters/express/adapt-routes'
import app from '@/main/config/app'
import { makeControllerStub } from './mocks/controller-mock'
import { notFound } from '@/main/middlewares/not-found'

import request from 'supertest'

const agent = request.agent(app)

describe('ErrorHandler', () => {
  beforeEach(() => {
    app.all('*', notFound)
    app.post('/notFound', adaptRoutes(makeControllerStub()))
  })

  it('Should return 404', async () => {
    await agent.post('/notFound').send({}).expect(404)
  })

  it('Should return a default error message', async () => {
    await agent
      .post('/notFound')
      .send({})
      .expect({ status: 'fail', data: { message: 'Cannot find the path: /notFound' } })
  })
})
