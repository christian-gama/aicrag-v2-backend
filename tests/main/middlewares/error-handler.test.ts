import { adaptRoutes } from '@/main/adapters/express/adapt-routes'
import app from '@/main/config/app'
import { errorHandler } from '@/main/middlewares/error-handler'
import { error, makeControllerStub } from './__mocks__/controller-mock'

import request from 'supertest'
import { env } from '@/main/config/env'

const agent = request.agent(app)

describe('ErrorHandler', () => {
  const environment = process.env.NODE_ENV as 'production' | 'development'
  afterAll(() => {
    env.SERVER.NODE_ENV = environment
  })

  beforeEach(() => {
    app.post('/error_handler', adaptRoutes(makeControllerStub()))
    app.use(errorHandler)
  })

  it('Should return statusCode 500', async () => {
    await agent.post('/error_handler').send({}).expect(500)
  })

  it('Should return a full error if environment is on development', async () => {
    env.SERVER.NODE_ENV = 'development'
    await agent
      .post('/error_handler')
      .send({})
      .expect({
        status: 'fail',
        data: { error: { name: error.name, message: error.message, stack: error.stack } }
      })
  })

  it('Should return a shorten error if environment is on production', async () => {
    env.SERVER.NODE_ENV = 'production'
    await agent
      .post('/error_handler')
      .send({})
      .expect({
        status: 'fail',
        data: { message: 'Internal error: Try again later' }
      })
  })
})