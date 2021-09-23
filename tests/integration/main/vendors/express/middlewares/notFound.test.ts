import { controllerAdapter } from '@/main/vendors/express/adapters/controller-adapter'
import app from '@/main/vendors/express/config/app'
import { notFound } from '@/main/vendors/express/middlewares/not-found'
import { makeControllerStub } from '@/tests/__mocks__/mock-controllers'

import request from 'supertest'

describe('ErrorHandler', () => {
  beforeEach(() => {
    app.all('*', notFound)
    app.post('/notFound', controllerAdapter(makeControllerStub()))
  })

  const agent = request.agent(app)

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
