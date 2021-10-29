import { InternalError } from '@/application/errors'

import { IController } from '@/presentation/controllers/protocols/controller-protocol'

import { environment } from '@/main/config/environment'
import { controllerAdapter } from '@/main/express/adapters/controller-adapter'
import App from '@/main/express/config/app'
import { errorRequestHandler } from '@/main/express/middlewares/error-request-handler'

import { Express } from 'express'
import request from 'supertest'

const error = new Error('any_message')
const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    async handle (httpRequest: any): Promise<any> {
      throw error
    }
  }

  return new ControllerStub()
}

describe('errorRequestHandler', () => {
  const env = process.env.NODE_ENV as 'production' | 'development'
  let app: Express

  afterAll(() => {
    environment.SERVER.NODE_ENV = env
  })

  beforeAll(async () => {
    app = await App.setup()

    app.post('/error_handler', controllerAdapter(makeControllerStub()))
    app.use(errorRequestHandler)
  })

  it('should return statusCode 500', async () => {
    const result = await request(app).post('/error_handler').send({})

    expect(result.status).toBe(500)
  })

  it('should return a full error if environment is on development', async () => {
    environment.SERVER.NODE_ENV = 'development'

    const result = await request(app).post('/error_handler').send({})

    expect(result.body).toStrictEqual({
      data: { error: { message: error.message, name: error.name, stack: error.stack } },
      status: 'fail'
    })
  })

  it('should return a shorten error if environment is on production', async () => {
    environment.SERVER.NODE_ENV = 'production'

    const result = await request(app).post('/error_handler').send({})

    expect(result.body).toStrictEqual({
      data: { message: new InternalError().message },
      status: 'fail'
    })
  })
})
