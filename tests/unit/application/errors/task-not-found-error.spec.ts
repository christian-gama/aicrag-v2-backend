import { TaskNotFoundError } from '@/application/errors'

describe('taskNotFoundError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new TaskNotFoundError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new TaskNotFoundError()

    expect(sut.message).toBe('No tasks were found')
  })
})