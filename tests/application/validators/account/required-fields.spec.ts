import { MissingParamError } from '@/application/errors'
import { RequiredFields } from '@/application/validators/account'

import faker from 'faker'

const field = faker.random.word()

describe('RequiredFields', () => {
  it('Should return MissingParamError if field is missing', () => {
    const sut = new RequiredFields(field)

    const value = sut.validate({ invalidField: faker.random.word })

    expect(value).toEqual(new MissingParamError(field))
  })

  it('Should return MissingParamError if field is empty', () => {
    const sut = new RequiredFields(field)

    const value = sut.validate({ [field]: '' })

    expect(value).toEqual(new MissingParamError(field))
  })

  it('Should return nothing if succeds', () => {
    const sut = new RequiredFields(field)

    const value = sut.validate({ [field]: faker.random.word })

    expect(value).toBeFalsy()
  })
})
