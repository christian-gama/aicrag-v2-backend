import { MissingParamError } from '@/application/errors'
import { RequiredFields } from '@/application/validators/account/required-fields'

describe('RequiredFields', () => {
  it('Should return MissingParamError if field is missing', () => {
    const sut = new RequiredFields('any_field')

    const value = sut.validate({ field: 'any_value', otherField: 'any_value' })

    expect(value).toEqual(new MissingParamError('any_field'))
  })

  it('Should return MissingParamError if field is empty', () => {
    const sut = new RequiredFields('any_field')

    const value = sut.validate({ any_field: '', otherField: 'any_value' })

    expect(value).toEqual(new MissingParamError('any_field'))
  })

  it('Should return nothing if succeds', () => {
    const sut = new RequiredFields('any_field')

    const value = sut.validate({ any_field: 'any_value', otherField: 'any_value' })

    expect(value).toBeFalsy()
  })
})
