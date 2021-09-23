import { IPublicUser, IUser } from '@/domain'

export const makeFakePublicUser = (user: IUser): IPublicUser => {
  const { personal, settings } = user

  return {
    personal: { id: personal.id, name: personal.name, email: personal.email },
    settings: { currency: settings.currency }
  }
}
