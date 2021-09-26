import { DecodedProtocol } from '@/application/protocols/cryptography'
import { ExpiredTokenError, InvalidTokenError } from '@/application/usecases/errors'

import { JwtAdapter } from '@/infra/adapters/cryptography'

import { environment } from '@/main/config/environment'

import jwt from 'jsonwebtoken'

interface SutTypes {
  sut: JwtAdapter
  expires: string
  secret: string
  token: string
}

const makeSut = (): SutTypes => {
  const expires = environment.JWT.ACCESS_EXPIRES
  const secret = environment.JWT.ACCESS_SECRET
  const token = jwt.sign({ id: 'any_id' }, secret, { expiresIn: expires })

  const sut = new JwtAdapter(expires, secret)

  return { sut, expires, secret, token }
}

describe('JwtAdapter', () => {
  describe('decode', () => {
    it('Should return an id if signature is valid', async () => {
      const { sut, token } = makeSut()

      const decodedToken = await sut.decode(token)

      expect((decodedToken as DecodedProtocol).id).toBe('any_id')
    })

    it('Should return ExpiredTokenError if verify throws', async () => {
      const { sut, token } = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        const error = new Error()
        error.name = 'TokenExpiredError'

        throw error
      })

      const decodedToken = await sut.decode(token)

      expect(decodedToken).toEqual(new ExpiredTokenError())
    })

    it('Should return InvalidToken if verify throws', async () => {
      const { sut, token } = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })

      const decodedToken = await sut.decode(token)

      expect(decodedToken).toEqual(new InvalidTokenError())
    })
  })

  describe('encrypt', () => {
    it('Should call sign with correct value', () => {
      const { sut, expires, secret } = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')

      sut.encrypt({ name: 'value' })

      expect(signSpy).toHaveBeenCalledWith({ name: 'value' }, secret, { expiresIn: expires })
    })

    it('Should return an encrypted value', () => {
      const { sut } = makeSut()

      const value = sut.encrypt({ name: 'value' })

      expect(value).not.toBe('value')
    })

    it('Should throw if sign throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      expect(sut.encrypt).toThrow()
    })
  })
})
