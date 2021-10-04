import { controllerAdapter } from '@/main/express/adapters/controller-adapter'
import app from '@/main/express/config/app'
import { notFound } from '@/main/express/middlewares/not-found'

import { makeControllerStub } from '@/tests/__mocks__/mock-controllers'

import request from 'supertest'

describe('errorHandler', () => {
  beforeEach(() => {
    app.all('*', notFound)
    app.get('/notFound', controllerAdapter(makeControllerStub()))
  })

  it('should return 404', async () => {
    expect.assertions(0)

    await request(app).get('/notFound').expect(404)
  })

  it('should return a default error message', async () => {
    expect.assertions(0)

    await request(app)
      .get('/notFound')
      .expect({ data: { message: 'Cannot find the path: /notFound', status: 'fail' } })
  })
})
