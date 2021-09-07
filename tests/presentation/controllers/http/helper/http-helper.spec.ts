import { makeSut } from './mocks/http-helper-mock'

import faker from 'faker'

describe('HttpHelper', () => {
  it('Should return 400 and an error message when calls badRequest', () => {
    const sut = makeSut()
    const errorMessage = faker.lorem.words(3)

    const response = sut.badRequest(new Error(errorMessage))

    expect(response).toEqual({ statusCode: 400, data: { message: errorMessage } })
  })

  it('Should return 404 and an error message when calls notFound', () => {
    const sut = makeSut()
    const errorMessage = faker.lorem.words(3)

    const response = sut.notFound(new Error(errorMessage))

    expect(response).toEqual({ statusCode: 404, data: { message: errorMessage } })
  })
})
