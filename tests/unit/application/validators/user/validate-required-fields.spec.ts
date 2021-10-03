import { MissingParamError } from '@/application/errors'
import { ValidateRequiredFields } from '@/application/validators/user'

import faker from 'faker'

interface SutTypes {
  fakeField: string
  sut: ValidateRequiredFields
}

const makeSut = (): SutTypes => {
  const fakeField = faker.random.word()
  const sut = new ValidateRequiredFields(fakeField)

  return { fakeField, sut }
}

describe('validateRequiredFields', () => {
  it('should return MissingParamError if field is missing', () => {
    expect.hasAssertions()

    const { fakeField, sut } = makeSut()

    const value = sut.validate({ invalidField: fakeField })

    expect(value).toStrictEqual(new MissingParamError(fakeField))
  })

  it('should return MissingParamError if field is empty', () => {
    expect.hasAssertions()

    const { fakeField, sut } = makeSut()

    const value = sut.validate({ [fakeField]: '' })

    expect(value).toStrictEqual(new MissingParamError(fakeField))
  })

  it('should return nothing if succeds', () => {
    expect.hasAssertions()

    const { sut, fakeField } = makeSut()

    const value = sut.validate({ [fakeField]: 'any_text' })

    expect(value).toBeFalsy()
  })
})
