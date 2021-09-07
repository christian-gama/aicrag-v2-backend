import { makeSut } from './mocks/http-helper-mock'

import faker from 'faker'

describe('HttpHelper', () => {
  it('Should return 400 and an error when calls badRequest', () => {
    const sut = makeSut()
    const errorMessage = faker.lorem.words(3)

    const response = sut.badRequest(new Error(errorMessage))

    expect(response).toEqual({ statusCode: 400, data: { message: errorMessage } })
  })
})
