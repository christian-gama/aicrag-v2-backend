import { User } from './user-protocol'

/**
 * @description Interface used to create a public user, which has hidden sensitive data.
 */
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
