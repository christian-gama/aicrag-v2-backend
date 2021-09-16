import { routeAdapter } from '@/main/vendors/express/adapters/route-adapter'
import app from '@/main/vendors/express/config/app'
import { notFound } from '@/main/vendors/express/middlewares/not-found'
import { makeControllerStub } from '@/tests/__mocks__/presentation/controllers/mock-controller'

import request from 'supertest'

const agent = request.agent(app)

describe('ErrorHandler', () => {
  beforeEach(() => {
    app.all('*', notFound)
    app.post('/notFound', routeAdapter(makeControllerStub()))
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
