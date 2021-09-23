import { ValidateRequiredFields } from '@/application/usecases/validators'

import faker from 'faker'

interface SutTypes {
  sut: ValidateRequiredFields
  fakeField: string
}

export const makeSut = (): SutTypes => {
  const fakeField = faker.random.word()
  const sut = new ValidateRequiredFields(fakeField)

  return { sut, fakeField }
}
