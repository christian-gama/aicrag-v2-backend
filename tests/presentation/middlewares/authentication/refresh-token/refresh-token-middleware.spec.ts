import { TokenMissingError } from '@/application/usecases/errors'
import { makeSut } from './refresh-token-middleware-sut'

describe('RefreshTokenMiddleware', () => {
  it('Should return unauthorized if there is no token ', async () => {
    const { sut, httpHelper } = makeSut()

    const response = await sut.handle({})

    expect(response).toEqual(httpHelper.unauthorized(new TokenMissingError()))
  })
})
