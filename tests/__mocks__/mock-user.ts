import { IUser, ISignUpUserCredentials, IPublicUser } from '@/domain'

import faker from 'faker'

export const makeFakeUser = (): IUser => {
  return {
    personal: {
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    },
    settings: { accountActivated: false, handicap: 1, currency: 'BRL' },
    logs: {
      createdAt: new Date(Date.now()),
      lastLoginAt: null,
      lastSeenAt: null,
      updatedAt: null
    },
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

const password = faker.internet.password()

export const makeFakeSignUpUserCredentials = (): ISignUpUserCredentials => {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: password,
    passwordConfirmation: password
  }
}

export const makeFakePublicUser = (user: IUser): IPublicUser => {
  const { personal, settings } = user

  return {
    personal: { id: personal.id, name: personal.name, email: personal.email },
    settings: { currency: settings.currency }
  }
}
