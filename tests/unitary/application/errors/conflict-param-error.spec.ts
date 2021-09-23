import { ConflictParamError } from '@/application/usecases/errors'

describe('ConflictParamError', () => {
  it('Should be an instance of Error', () => {
    const sut = new ConflictParamError('any_field')

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new ConflictParamError('any_field')

    expect(sut.message).toBe('Param already exists: any_field')
  })
})
