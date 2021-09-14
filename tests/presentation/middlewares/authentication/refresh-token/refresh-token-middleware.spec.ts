import { TokenMissingError } from '@/application/usecases/errors'
import { makeSut } from './refresh-token-middleware-sut'

describe('RefreshTokenMiddleware', () => {
  it('Should return unauthorized if there is no token ', async () => {
    const { sut, httpHelper } = makeSut()

    const response = await sut.handle({})

    expect(response).toEqual(httpHelper.unauthorized(new TokenMissingError()))
  })

  it('Should call decodeId with correct token', async () => {
    const { sut, decoder, request } = makeSut()
    const decodeIdSpy = jest.spyOn(decoder, 'decodeId')

    await sut.handle(request)

    expect(decodeIdSpy).toHaveBeenCalledWith(request.token)
  })
})
