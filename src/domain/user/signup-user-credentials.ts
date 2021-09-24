/**
 * @description Interface used to create a new account.
 */
export interface ISignUpUserCredentials {
  email: string
  name: string
  password: string
  passwordConfirmation: string
}
