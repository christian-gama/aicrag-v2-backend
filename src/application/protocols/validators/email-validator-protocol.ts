export interface EmailValidatorProtocol {
  /**
   * @description Receive value and verify if it is a valid email.
   * @param value Value that will be verified.
   * @returns Return true if the email is valid, false if is invalid.
   */
  isEmail: (value: string) => boolean
}
