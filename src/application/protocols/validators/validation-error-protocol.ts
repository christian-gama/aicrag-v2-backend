import {
  InvalidCodeError,
  CodeIsExpiredError,
  AccountAlreadyActivatedError,
  InactiveAccountError,
  UserCredentialError,
  InvalidParamError,
  ConflictParamError,
  MissingParamError
} from '@/application/usecases/errors'

export type ValidatorErrorProtocol =
  | InvalidCodeError
  | CodeIsExpiredError
  | AccountAlreadyActivatedError
  | InactiveAccountError
  | UserCredentialError
  | InvalidParamError
  | ConflictParamError
  | MissingParamError
