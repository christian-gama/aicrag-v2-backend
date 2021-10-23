import { IUser, IPublicUser } from '@/domain'
import { IFilterUserData } from '@/domain/helpers'

export class FilterUserData implements IFilterUserData {
  filter (user: IUser): IPublicUser {
    return {
      personal: {
        email: user.personal.email,
        id: user.personal.id,
        name: user.personal.name
      },
      settings: {
        currency: user.settings.currency
      }
    }
  }
}
