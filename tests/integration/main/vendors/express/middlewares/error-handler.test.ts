import { controllerAdapter } from '@/infra/adapters/express/controller-adapter'

import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { environment } from '@/main/config/environment'
import app from '@/main/express/config/app'
import { errorRequestHandler } from '@/main/express/middlewares/error-request-handler'

import request from 'supertest'

const error = new Error('any_message')
const makeControllerStub = (): ControllerProtocol => {
  class ControllerStub implements ControllerProtocol {
    async handle (httpRequest: any): Promise<any> {
      throw error
    }
  }

  return new ControllerStub()
}

describe('errorRequestHandler', () => {
  const env = process.env.NODE_ENV as 'production' | 'development'

  afterAll(() => {
    environment.SERVER.NODE_ENV = env
  })

  beforeAll(() => {
    app.post('/error_handler', controllerAdapter(makeControllerStub()))
    app.use(errorRequestHandler)
  })

  const agent = request.agent(app)

  it('should return statusCode 500', async () => {
    expect.assertions(0)

    await agent.post('/error_handler').send({}).expect(500)
  })

  it('should return a full error if environment is on development', async () => {
    expect.assertions(0)

    environment.SERVER.NODE_ENV = 'development'

    await agent
      .post('/error_handler')
      .send({})
      .expect({
        data: { error: { message: error.message, name: error.name, stack: error.stack } },
        status: 'fail'
      })
  })

  it('should return a shorten error if environment is on production', async () => {
    expect.assertions(0)

    environment.SERVER.NODE_ENV = 'production'

    await agent
      .post('/error_handler')
      .send({})
      .expect({
        data: { message: 'Internal error: Try again later' },
        status: 'fail'
      })
  })
})
