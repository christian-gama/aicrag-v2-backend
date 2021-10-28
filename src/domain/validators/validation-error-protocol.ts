import {
  AccountAlreadyActivatedError,
  PinIsExpiredError,
  ConflictParamError,
  InactiveAccountError,
  InvalidPinError,
  InvalidParamError,
  MissingParamError,
  UserCredentialError
} from '@/application/errors'

/**
 * @description Errors that can be returned by validator.
 */
export type IValidatorError =
  | AccountAlreadyActivatedError
  | PinIsExpiredError
  | ConflictParamError
  | InactiveAccountError
  | InvalidPinError
  | InvalidParamError
  | MissingParamError
  | UserCredentialError
