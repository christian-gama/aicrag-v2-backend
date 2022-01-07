import { ConflictParamError } from '@/application/errors'

describe('conflictParamError', () => {
  it('should be an instance of Error', () => {
    const sut = new ConflictParamError('any_field')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new ConflictParamError('any_field')

    const result = sut.message

    expect(result).toBe('Parâmetro já existe: any_field')
  })
})
