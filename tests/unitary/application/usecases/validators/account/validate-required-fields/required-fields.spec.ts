import { MissingParamError } from '@/application/usecases/errors'

import { makeSut } from './required-fields-sut'

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
