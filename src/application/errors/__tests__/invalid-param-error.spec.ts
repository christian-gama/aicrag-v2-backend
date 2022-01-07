import { InvalidParamError } from '@/application/errors'

describe('invalidParamError', () => {
  it('should be an instance of Error', () => {
    const sut = new InvalidParamError('any_field')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new InvalidParamError('any_field')

    const result = sut.message

    expect(result).toBe('Parâmetro inválido: any_field')
  })
})
