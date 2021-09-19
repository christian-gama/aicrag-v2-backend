/**
 * @description Interface used to create a new account.
 */
export interface ISignUpUserCredentials {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}
