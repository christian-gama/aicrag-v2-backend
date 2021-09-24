import { IPublicUser, ISignUpUserCredentials, IUser } from '@/domain'

import faker from 'faker'

export const makeFakePublicUser = (user: IUser): IPublicUser => {
  const { personal, settings } = user

  return {
    personal: { email: personal.email, id: personal.id, name: personal.name },
    settings: { currency: settings.currency }
  }
}

export const makeFakeSignUpUserCredentials = (): ISignUpUserCredentials => {
  const password = faker.internet.password()
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: password,
    passwordConfirmation: password
  }
}

export const makeFakeUser = (): IUser => {
  return {
    logs: {
      createdAt: new Date(Date.now()),
      lastLoginAt: null,
      lastSeenAt: null,
      updatedAt: null
    },
    personal: {
      email: faker.internet.email(),
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      password: faker.internet.password()
    },
    settings: { accountActivated: false, handicap: 1, currency: 'BRL' },
    temporary: {
      activationCode: faker.lorem.word(5),
      activationCodeExpiration: new Date(Date.now() + 10 * 60 * 1000),
      resetPasswordToken: null,
      tempEmail: null,
      tempEmailCode: null,
      tempEmailCodeExpiration: null
    },
    tokenVersion: 0
  }
}
