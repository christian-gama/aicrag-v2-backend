import { makeSut } from './mocks/jwt-adapter-mock'
import jwt from 'jsonwebtoken'

describe('JwtAdapter', () => {
  describe('Decode', () => {
    it('Should return an id if signature is valid', async () => {
      const { sut, token } = makeSut()

      const id = await sut.decodeId(token)

      expect(id).toBe('any_id')
    })
  })

  describe('Encrypt', () => {
    it('Should call sign with correct value', () => {
      const { sut, secret, expires } = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')

      sut.encryptId('value')

      expect(signSpy).toHaveBeenCalledWith({ id: 'value' }, secret, { expiresIn: expires })
    })

    it('Should return an encrypted value', () => {
      const { sut } = makeSut()

      const value = sut.encryptId('value')

      expect(value).not.toBe('value')
    })

    it('Should throw if sign throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      expect(sut.encryptId).toThrow()
    })
  })
})
