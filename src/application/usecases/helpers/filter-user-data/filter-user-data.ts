import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { PublicUser, User } from '@/domain/user'

export class FilterUserData implements FilterUserDataProtocol {
  filter (user: User): PublicUser {
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
