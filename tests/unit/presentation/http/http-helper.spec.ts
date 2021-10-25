import { HttpHelper } from '@/presentation/http/http-helper'

import faker from 'faker'

interface SutTypes {
  sut: HttpHelper
}

const makeSut = (): SutTypes => {
  const sut = new HttpHelper()

  return { sut }
}

describe('httpHelper', () => {
  describe('statusCode: 200 ~ 204', () => {
    it('should return 200 and a data when calls ok', () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const fakeData = { [faker.random.word()]: faker.random.word() }

      const result = sut.ok(fakeData)

      expect(result).toStrictEqual({ data: fakeData, status: true, statusCode: 200 })
    })

    it('should return 201 and a data when calls created', () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const fakeData = { [faker.random.word()]: faker.random.word() }

      const result = sut.created(fakeData)

      expect(result).toStrictEqual({ data: fakeData, status: true, statusCode: 201 })
    })

    it('should return 204 and a data when calls deleted', () => {
      expect.hasAssertions()

      const { sut } = makeSut()

      const result = sut.deleted()

      expect(result).toStrictEqual({
        data: { message: 'Content deleted' },
        status: true,
        statusCode: 204
      })
    })
  })

  describe('statusCode: 400 ~ 409', () => {
    it('should return 400 and an error message when calls badRequest', () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const errorMessage = faker.lorem.words(3)

      const result = sut.badRequest(new Error(errorMessage))

      expect(result).toStrictEqual({
        data: { message: errorMessage },
        status: false,
        statusCode: 400
      })
    })

    it('should return 401 and an error message when calls unauthorized', () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const errorMessage = faker.lorem.words(3)

      const result = sut.unauthorized(new Error(errorMessage))

      expect(result).toStrictEqual({
        data: { message: errorMessage },
        status: false,
        statusCode: 401
      })
    })

    it('should return 403 and an error message when calls forbidden', () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const errorMessage = faker.lorem.words(3)

      const result = sut.forbidden(new Error(errorMessage))

      expect(result).toStrictEqual({
        data: { message: errorMessage },
        status: false,
        statusCode: 403
      })
    })

    it('should return 404 and an error message when calls notFound', () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const errorMessage = faker.lorem.words(3)

      const result = sut.notFound(new Error(errorMessage))

      expect(result).toStrictEqual({
        data: { message: errorMessage },
        status: false,
        statusCode: 404
      })
    })

    it('should return 409 and an error message when calls conflict', () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const errorMessage = faker.lorem.words(3)

      const result = sut.conflict(new Error(errorMessage))

      expect(result).toStrictEqual({
        data: { message: errorMessage },
        status: false,
        statusCode: 409
      })
    })
  })

  describe('statusCode: 500', () => {
    it('should return 500 when call serverError', () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const error = new Error('any_message')

      const result = sut.serverError(error)

      expect(result).toStrictEqual({
        data: { error: { message: error.message, name: error.name, stack: error.stack } },
        status: false,
        statusCode: 500
      })
    })
  })
})
