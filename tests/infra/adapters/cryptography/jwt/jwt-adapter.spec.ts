import { makeSut } from './jwt-adapter-sut'

import jwt from 'jsonwebtoken'

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
