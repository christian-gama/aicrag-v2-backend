type ValidatorReturnProtocol = Promise<Error | undefined> | Error | undefined

export interface ValidatorProtocol {
  /**
   * @description Receive a generic object and validate it.
   * @param input Is the object to be validated.
   * @returns Return an Error if validation fails and return undefined if succeds.
   */
  validate: (input: Record<any, any>) => ValidatorReturnProtocol
}
