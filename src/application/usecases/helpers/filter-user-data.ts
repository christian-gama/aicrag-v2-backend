import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { IUser, IPublicUser } from '@/domain'

export class FilterUserData implements FilterUserDataProtocol {
  filter (user: IUser): IPublicUser {
    return {
      personal: {
        id: user.personal.id,
        name: user.personal.name,
        email: user.personal.email
      },
      settings: {
        currency: user.settings.currency
      }
    }
  }
}
