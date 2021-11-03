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
    const { fakeField, sut } = makeSut()

    const result = sut.validate({ invalidField: fakeField })

    expect(result).toStrictEqual(new MissingParamError(fakeField))
  })

  it('should return MissingParamError if field is empty', () => {
    const { fakeField, sut } = makeSut()

    const result = sut.validate({ [fakeField]: '' })

    expect(result).toStrictEqual(new MissingParamError(fakeField))
  })

  it('should return nothing if succeeds', () => {
    const { sut, fakeField } = makeSut()

    const result = sut.validate({ [fakeField]: 'any_text' })

    expect(result).toBeFalsy()
  })
})
