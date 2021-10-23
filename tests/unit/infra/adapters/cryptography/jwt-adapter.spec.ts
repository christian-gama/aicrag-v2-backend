import { IDecoded } from '@/domain/cryptography'

import { ExpiredTokenError, InvalidTokenError } from '@/application/errors'

import { JwtAdapter } from '@/infra/adapters/cryptography'

import { environment } from '@/main/config/environment'

import jwt from 'jsonwebtoken'

interface SutTypes {
  expires: string
  secret: string
  sut: JwtAdapter
  token: string
}

const makeSut = (): SutTypes => {
  const expires = environment.JWT.ACCESS_EXPIRES
  const secret = environment.JWT.ACCESS_SECRET
  const token = jwt.sign({ id: 'any_id' }, secret, { expiresIn: expires })

  const sut = new JwtAdapter(expires, secret)

  return { expires, secret, sut, token }
}

describe('jwtAdapter', () => {
  describe('decode', () => {
    it('should return an id if signature is valid', async () => {
      expect.hasAssertions()

      const { sut, token } = makeSut()

      const decodedToken = await sut.decode(token)

      expect((decodedToken as IDecoded).id).toBe('any_id')
    })

    it('should return ExpiredTokenError if verify throws', async () => {
      expect.hasAssertions()

      const { sut, token } = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        const error = new Error()
        error.name = 'TokenExpiredError'

        throw error
      })

      const decodedToken = await sut.decode(token)

      expect(decodedToken).toStrictEqual(new ExpiredTokenError())
    })

    it('should return InvalidToken if verify throws', async () => {
      expect.hasAssertions()

      const { sut, token } = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })

      const decodedToken = await sut.decode(token)

      expect(decodedToken).toStrictEqual(new InvalidTokenError())
    })
  })

  describe('encrypt', () => {
    it('should call sign with correct value', () => {
      expect.hasAssertions()

      const { expires, secret, sut } = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')

      sut.encrypt({ name: 'value' })

      expect(signSpy).toHaveBeenCalledWith({ name: 'value' }, secret, { expiresIn: expires })
    })

    it('should return an encrypted value', () => {
      expect.hasAssertions()

      const { sut } = makeSut()

      const value = sut.encrypt({ name: 'value' })

      expect(value).not.toBe('value')
    })

    it('should throw if sign throws', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      const encrypt = sut.encrypt.bind(sut)

      expect(encrypt).toThrow('')
    })
  })
})
