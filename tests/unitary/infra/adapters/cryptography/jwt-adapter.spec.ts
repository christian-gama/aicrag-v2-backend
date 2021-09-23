import { JwtAdapter } from '@/infra/adapters/cryptography/jwt'
import { env } from '@/main/config/env'

import jwt from 'jsonwebtoken'

interface SutTypes {
  sut: JwtAdapter
  expires: string
  secret: string
  token: string
}

const makeSut = (): SutTypes => {
  const expires = env.JWT.ACCESS_EXPIRES
  const secret = env.JWT.ACCESS_SECRET
  const token = jwt.sign({ id: 'any_id' }, secret, { expiresIn: expires })
  const sut = new JwtAdapter(expires, secret)

  return { sut, expires, secret, token }
}

describe('JwtAdapter', () => {
  describe('decode', () => {
    it('Should return an id if signature is valid', async () => {
      const { sut, token } = makeSut()

      const decodedToken = await sut.decode(token)

      expect(decodedToken.id).toBe('any_id')
    })
  })

  describe('encrypt', () => {
    it('Should call sign with correct value', () => {
      const { sut, secret, expires } = makeSut()
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
