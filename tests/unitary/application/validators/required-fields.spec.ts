import { MissingParamError } from '@/application/usecases/errors'
import { ValidateRequiredFields } from '@/application/usecases/validators'

import faker from 'faker'

interface SutTypes {
  sut: ValidateRequiredFields
  fakeField: string
}

const makeSut = (): SutTypes => {
  const fakeField = faker.random.word()
  const sut = new ValidateRequiredFields(fakeField)

  return { sut, fakeField }
}

describe('RequiredFields', () => {
  it('Should return MissingParamError if field is missing', () => {
    const { sut, fakeField } = makeSut()

    const value = sut.validate({ invalidField: fakeField })

    expect(value).toEqual(new MissingParamError(fakeField))
  })

  it('Should return MissingParamError if field is empty', () => {
    const { sut, fakeField } = makeSut()

    const value = sut.validate({ [fakeField]: '' })

    expect(value).toEqual(new MissingParamError(fakeField))
  })

  it('Should return nothing if succeds', () => {
    const { sut, fakeField } = makeSut()

    const value = sut.validate({ [fakeField]: 'any_text' })

    expect(value).toBeFalsy()
  })
})
