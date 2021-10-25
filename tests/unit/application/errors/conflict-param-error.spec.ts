import { ConflictParamError } from '@/application/errors'

describe('conflictParamError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new ConflictParamError('any_field')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new ConflictParamError('any_field')

    const result = sut.message

    expect(result).toBe('Param already exists: any_field')
  })
})
