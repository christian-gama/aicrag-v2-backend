export interface ValidatorProtocol {
  /**
   * @param input Is the object to be validated.
   * @returns Return an Error if validation fails and return undefined if succeds.
   */
  validate: (input: Record<any, any>) => Error | undefined
}
