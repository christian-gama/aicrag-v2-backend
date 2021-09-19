import { ISignUpUserCredentials } from '../../domain/user/index'

import faker from 'faker'

const password = faker.internet.password()

export const makeFakeSignUpUserCredentials = (): ISignUpUserCredentials => {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: password,
    passwordConfirmation: password
  }
}
