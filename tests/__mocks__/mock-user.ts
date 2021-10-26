import { IPublicUser, ISignUpUserData, IUser } from '@/domain'

import faker from 'faker'

export const makeFakePublicUser = (user: IUser): IPublicUser => {
  const { personal, settings } = user

  return {
    personal: { email: personal.email, id: personal.id, name: personal.name },
    settings: { currency: settings.currency }
  }
}

export const makeFakeSignUpUserCredentials = (): ISignUpUserData => {
  const password = faker.internet.password()
  return {
    email: faker.internet.email().toLowerCase(),
    name: faker.name.findName(),
    password: password,
    passwordConfirmation: password
  }
}

export const makeFakeUser = (userProperty?: Record<any, any>): IUser => {
  return {
    logs: {
      createdAt: new Date(Date.now()),
      lastLoginAt: null,
      lastSeenAt: null,
      updatedAt: null
    },
    personal: {
      email: faker.internet.email().toLowerCase(),
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      password: faker.internet.password(8)
    },
    settings: { accountActivated: false, currency: 'BRL', handicap: 1 },
    temporary: {
      activationCode: faker.lorem.word(5),
      activationCodeExpiration: new Date(Date.now() + 10 * 60 * 1000),
      resetPasswordToken: null,
      tempEmail: null,
      tempEmailCode: null,
      tempEmailCodeExpiration: null
    },
    tokenVersion: 0,
    ...userProperty
  }
}
