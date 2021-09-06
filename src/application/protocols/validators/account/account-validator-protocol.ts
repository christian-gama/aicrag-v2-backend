export interface AccountValidatorProtocol {
  /**
   * @param input Is the object to be validated.
   * @returns Return an Error if validation fails and return undefined if succeds.
   */
  validate: (input: Record<any, unknown>) => Error | undefined
}
