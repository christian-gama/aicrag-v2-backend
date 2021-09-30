import { IUser, IPublicUser } from '@/domain'
import { FilterUserDataProtocol } from '@/domain/helpers'

export class FilterUserData implements FilterUserDataProtocol {
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
