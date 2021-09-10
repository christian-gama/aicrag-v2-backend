import { PublicUser, User } from '@/domain/user'

export const makeFakePublicUser = (user: User): PublicUser => {
  const { personal, settings } = user

  return {
    personal: { id: personal.id, name: personal.name, email: personal.email },
    settings: { currency: settings.currency }
  }
}
