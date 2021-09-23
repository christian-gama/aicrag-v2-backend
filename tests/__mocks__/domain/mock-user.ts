import { IUser } from '@/domain'

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
