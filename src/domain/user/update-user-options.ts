import { User } from '.'

export interface UpdateUserOptions {
  'personal.id'?: User['personal']['id']
  'personal.email'?: User['personal']['email']
  'personal.name'?: User['personal']['name']
  'personal.password'?: User['personal']['password']
  'settings.accountActivated'?: User['settings']['accountActivated']
  'settings.currency'?: User['settings']['currency']
  'temporary.activationCode'?: string
  'temporary.activationCodeExpiration'?: Date
  'temporary.temporaryEmail'?: string
  'temporary.temporaryEmailExpiration'?: Date
  'temporary.resetCode'?: string
  'temporary.resetCodeExpiration'?: Date
}
