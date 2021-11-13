import { PermissionError } from '@/application/errors'

describe('permissionError', () => {
  it('should be an instance of Error', () => {
    const sut = new PermissionError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new PermissionError()

    const result = sut.message

    expect(result).toBe('You have no permission')
  })
})
