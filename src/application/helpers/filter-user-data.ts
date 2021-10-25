import { IUser, IPublicUser } from '@/domain'
import { IFilterUserData } from '@/domain/helpers'

export class FilterUserData implements IFilterUserData {
  filter (user: IUser): IPublicUser {
    const result = {
      personal: {
        email: user.personal.email,
        id: user.personal.id,
        name: user.personal.name
      },
      settings: {
        currency: user.settings.currency
      }
    }

    return result
  }
}
