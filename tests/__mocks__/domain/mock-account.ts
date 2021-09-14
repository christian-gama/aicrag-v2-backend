import { UserAccount } from '../../domain/user'

import faker from 'faker'

const password = faker.internet.password()

export const makeFakeValidAccount = (): UserAccount => {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: password,
    passwordConfirmation: password
  }
}
