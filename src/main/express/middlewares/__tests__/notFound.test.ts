import { controllerAdapter } from '@/main/express/adapters/controller-adapter'
import { notFound } from '@/main/express/middlewares/not-found'
import { makeControllerStub } from '@/tests/__mocks__/mock-controllers'
import express, { Express } from 'express'
import request from 'supertest'

describe('errorHandler', () => {
  let app: Express

  beforeAll(async () => {
    app = express()
  })

  beforeEach(() => {
    app.all('*', notFound)
    app.get('/notFound', controllerAdapter(makeControllerStub()))
  })

  it('should return 404', async () => {
    const result = await request(app).get('/notFound')

    expect(result.status).toBe(404)
  })

  it('should return a default error message', async () => {
    const result = await request(app).get('/notFound')

    expect(result.body).toStrictEqual({ data: { message: 'Cannot find the path: /notFound', status: 'fail' } })
  })
})
