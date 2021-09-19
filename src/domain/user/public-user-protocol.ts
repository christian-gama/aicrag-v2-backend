import { IUser } from './user-protocol'

/**
 * @description Interface used to create a public user, which has hidden sensitive data.
 */
export interface PublicUser {
  personal: {
    id: IUser['personal']['id']
    name: IUser['personal']['name']
    email: IUser['personal']['email']
  }
  settings: {
    currency: IUser['settings']['currency']
  }
}
