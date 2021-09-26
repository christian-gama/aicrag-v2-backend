import { controllerAdapter } from '@/main/vendors/express/adapters/controller-adapter'
import app from '@/main/vendors/express/config/app'
import { notFound } from '@/main/vendors/express/middlewares/not-found'

import { makeControllerStub } from '@/tests/__mocks__/mock-controllers'

import request from 'supertest'

describe('errorHandler', () => {
  beforeEach(() => {
    app.all('*', notFound)
    app.get('/notFound', controllerAdapter(makeControllerStub()))
  })

  const agent = request.agent(app)

  it('should return 404', async () => {
    expect.assertions(0)

    await agent.get('/notFound').expect(404)
  })

  it('should return a default error message', async () => {
    expect.assertions(0)

    await agent
      .get('/notFound')
      .expect({ data: { message: 'Cannotfindthepath:/notFound', status: 'fail' } })
  })
})
