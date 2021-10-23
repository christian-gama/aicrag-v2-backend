import { IValidatorError } from './validation-error-protocol'

type IValidatorReturn = Promise<IValidatorError | undefined> | IValidatorError | undefined

export interface IValidator {
  /**
   * @description Receive a generic object and validate it.
   * @param input Is the object to be validated.
   * @returns Return an Error if validation fails and return undefined if succeeds.
   */
  validate: (input: Record<any, any>) => IValidatorReturn
}
