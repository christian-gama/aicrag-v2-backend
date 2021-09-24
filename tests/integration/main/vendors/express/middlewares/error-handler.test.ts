import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import app from '@/main/vendors/express/config/app'
import { controllerAdapter } from '@/main/vendors/express/adapters/controller-adapter'
import { environment } from '@/main/config/environment'
import { errorRequestHandler } from '@/main/vendors/express/middlewares/error-request-handler'

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

describe('ErrorRequestHandler', () => {
  const env = process.env.NODE_ENV as 'production' | 'development'

  afterAll(() => {
    environment.SERVER.NODE_ENV = env
  })

  beforeEach(() => {
    app.post('/error_handler', controllerAdapter(makeControllerStub()))
    app.use(errorRequestHandler)
  })

  const agent = request.agent(app)

  it('Should return statusCode 500', async () => {
    await agent.post('/error_handler').send({}).expect(500)
  })

  it('Should return a full error if environment is on development', async () => {
    environment.SERVER.NODE_ENV = 'development'
    await agent
      .post('/error_handler')
      .send({})
      .expect({
        status: 'fail',
        data: { error: { name: error.name, message: error.message, stack: error.stack } }
      })
  })

  it('Should return a shorten error if environment is on production', async () => {
    environment.SERVER.NODE_ENV = 'production'
    await agent
      .post('/error_handler')
      .send({})
      .expect({
        status: 'fail',
        data: { message: 'Internal error: Try again later' }
      })
  })
})