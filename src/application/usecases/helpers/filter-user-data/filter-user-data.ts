import { IPublicUser, IUser } from '@/domain/user/index'
import { FilterUserDataProtocol } from '@/application/usecases/helpers/filter-user-data'

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
