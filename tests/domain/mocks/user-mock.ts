import { User } from '@/domain/user'

import faker from 'faker'

export const makeFakeUser = (): User => {
  return {
    personal: {
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    },
    settings: { accountActivated: false, handicap: 1, currency: 'USD' },
    logs: {
      createdAt: new Date(Date.now()),
      lastLogin: null,
      lastSeen: null,
      updatedAt: null
    },
    temporary: {
      activationCode: faker.lorem.word(5)
    }
  }
}
