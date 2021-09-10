import { User } from './user-protocol'

export interface PublicUser {
  personal: {
    id: User['personal']['id']
    name: User['personal']['name']
    email: User['personal']['email']
  }
  settings: {
    currency: User['settings']['currency']
  }
}
