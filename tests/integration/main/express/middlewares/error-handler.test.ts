import { InternalError } from '@/application/errors'

import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { environment } from '@/main/config/environment'
import { controllerAdapter } from '@/main/express/adapters/controller-adapter'
import { setupApp } from '@/main/express/config/app'
import { errorRequestHandler } from '@/main/express/middlewares/error-request-handler'

import { Express } from 'express'
import request from 'supertest'

let app: Express

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

  beforeAll(async () => {
    app = await setupApp()

    app.post('/error_handler', controllerAdapter(makeControllerStub()))
    app.use(errorRequestHandler)
  })

  it('should return statusCode 500', async () => {
    expect.assertions(0)

    await request(app).post('/error_handler').send({}).expect(500)
  })

  it('should return a full error if environment is on development', async () => {
    expect.assertions(0)

    environment.SERVER.NODE_ENV = 'development'

    await request(app)
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

    await request(app)
      .post('/error_handler')
      .send({})
      .expect({
        data: { message: new InternalError().message },
        status: 'fail'
      })
  })
})
