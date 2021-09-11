import { InternalError } from '@/application/usecases/errors'
import { makeSut } from './mocks/http-helper-mock'

import faker from 'faker'

describe('HttpHelper', () => {
  describe('StatusCode: 400 ~ 409', () => {
    it('Should return 400 and an error message when calls badRequest', () => {
      const sut = makeSut()
      const errorMessage = faker.lorem.words(3)

      const response = sut.badRequest(new Error(errorMessage))

      expect(response).toEqual({ status: 'fail', statusCode: 400, data: { message: errorMessage } })
    })

    it('Should return 401 and an error message when calls unauthorized', () => {
      const sut = makeSut()
      const errorMessage = faker.lorem.words(3)

      const response = sut.unauthorized(new Error(errorMessage))

      expect(response).toEqual({ status: 'fail', statusCode: 401, data: { message: errorMessage } })
    })

    it('Should return 403 and an error message when calls forbidden', () => {
      const sut = makeSut()
      const errorMessage = faker.lorem.words(3)

      const response = sut.forbidden(new Error(errorMessage))

      expect(response).toEqual({ status: 'fail', statusCode: 403, data: { message: errorMessage } })
    })

    it('Should return 404 and an error message when calls notFound', () => {
      const sut = makeSut()
      const errorMessage = faker.lorem.words(3)

      const response = sut.notFound(new Error(errorMessage))

      expect(response).toEqual({ status: 'fail', statusCode: 404, data: { message: errorMessage } })
    })

    it('Should return 409 and an error message when calls conflict', () => {
      const sut = makeSut()
      const errorMessage = faker.lorem.words(3)

      const response = sut.conflict(new Error(errorMessage))

      expect(response).toEqual({ status: 'fail', statusCode: 409, data: { message: errorMessage } })
    })
  })

  describe('StatusCode: 200 ~ 204', () => {
    it('Should return 200 and a data when calls ok', () => {
      const sut = makeSut()
      const fakeData = { [faker.random.word()]: faker.random.word() }

      const response = sut.ok(fakeData)

      expect(response).toEqual({ status: 'success', statusCode: 200, data: fakeData })
    })

    it('Should return 200 a data and an accessToken if one is passed when calls ok', () => {
      const sut = makeSut()
      const fakeData = { [faker.random.word()]: faker.random.word() }

      const response = sut.ok(fakeData, 'any_token')

      expect(response).toEqual({
        status: 'success',
        statusCode: 200,
        data: fakeData,
        accessToken: 'any_token'
      })
    })

    it('Should return 201 and a data when calls created', () => {
      const sut = makeSut()
      const fakeData = { [faker.random.word()]: faker.random.word() }

      const response = sut.created(fakeData)

      expect(response).toEqual({ status: 'success', statusCode: 201, data: fakeData })
    })

    it('Should return 204 and a data when calls deleted', () => {
      const sut = makeSut()

      const response = sut.deleted()

      expect(response).toEqual({
        status: 'success',
        statusCode: 204,
        data: { message: 'Content deleted' }
      })
    })
  })

  describe('StatusCode: 500', () => {
    it('Should return 500 when call serverError', () => {
      const sut = makeSut()

      const error = new InternalError()
      const response = sut.serverError(error)

      expect(response).toEqual({
        status: 'fail',
        statusCode: 500,
        data: { error: { name: error.name, message: error.message, stack: error.stack } }
      })
    })
  })
})
