import { makeSut } from './mocks/jwt-adapter-mock'
import jwt from 'jsonwebtoken'

describe('JwtAdapter', () => {
  it('Should call sign with correct value', () => {
    const { sut, secret } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')

    sut.encrypt('value')

    expect(signSpy).toHaveBeenCalledWith({ id: 'value' }, secret)
  })
})
