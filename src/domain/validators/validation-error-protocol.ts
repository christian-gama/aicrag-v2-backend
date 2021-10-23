import {
  AccountAlreadyActivatedError,
  CodeIsExpiredError,
  ConflictParamError,
  InactiveAccountError,
  InvalidCodeError,
  InvalidParamError,
  MissingParamError,
  UserCredentialError
} from '@/application/errors'

/**
 * @description Errors that can be returned by validator.
 */
export type IValidatorError =
  | AccountAlreadyActivatedError
  | CodeIsExpiredError
  | ConflictParamError
  | InactiveAccountError
  | InvalidCodeError
  | InvalidParamError
  | MissingParamError
  | UserCredentialError
