import { PublicUser, IUser } from '@/domain/user/index'

export const makeFakePublicUser = (user: IUser): PublicUser => {
  const { personal, settings } = user

  return {
    personal: { id: personal.id, name: personal.name, email: personal.email },
    settings: { currency: settings.currency }
  }
}
