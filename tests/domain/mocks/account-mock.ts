import faker from 'faker'

const password = faker.internet.password()

export const fakeValidAccount = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: password,
  passwordConfirmation: password
}
