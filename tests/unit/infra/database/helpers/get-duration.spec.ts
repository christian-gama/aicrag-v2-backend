import { getDuration } from '@/infra/database/helpers'

describe('getDuration', () => {
  it('should append $ to the object property', () => {
    const result = getDuration(30, 'gte')

    expect(result).toStrictEqual({ $gte: 30 })
  })
})
