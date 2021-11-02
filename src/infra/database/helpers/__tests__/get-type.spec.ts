import { getType } from '@/infra/database/helpers'

describe('getType', () => {
  it('should return { $ne: null } if type is both', () => {
    const type = 'both'
    const result = getType(type)

    expect(result).toStrictEqual({ $ne: null })
  })

  it('should return TX if there the type is TX', () => {
    const type = 'TX'

    const result = getType(type)

    expect(result).toBe('TX')
  })
})
