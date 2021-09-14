/**
 * @description Interface used to create a new account.
 */
export interface SignUpUserCredentials {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}
