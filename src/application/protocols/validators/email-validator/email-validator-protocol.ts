export interface EmailValidator {
  /**
   * @param value The value to verify if is a valid email.
   * @returns Return true if the email is valid, false if is invalid.
   */
  isEmail: (value: string) => boolean
}
