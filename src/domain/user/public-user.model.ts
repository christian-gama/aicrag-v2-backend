import { IUser } from './user.model'

/**
 * @description Interface used to create a public user, which has hidden sensitive data.
 */
export interface IPublicUser {
  personal: {
    email: IUser['personal']['email']
    id: IUser['personal']['id']
    name: IUser['personal']['name']
  }
  settings: {
    currency: IUser['settings']['currency']
    role: IUser['settings']['role']
  }
}
