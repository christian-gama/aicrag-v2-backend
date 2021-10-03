import { ValidatorErrorProtocol } from './validation-error-protocol'

type ValidatorReturnProtocol =
  | Promise<ValidatorErrorProtocol | undefined>
  | ValidatorErrorProtocol
  | undefined

export interface ValidatorProtocol {
  /**
   * @description Receive a generic object and validate it.
   * @param input Is the object to be validated.
   * @returns Return an Error if validation fails and return undefined if succeeds.
   */
  validate: (input: Record<any, any>) => ValidatorReturnProtocol
}
