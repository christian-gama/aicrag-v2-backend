import {
  AccountAlreadyActivatedError,
  CodeIsExpiredError,
  ConflictParamError,
  InactiveAccountError,
  InvalidCodeError,
  InvalidParamError,
  MissingParamError,
  UserCredentialError
} from '@/application/usecases/errors'

export type ValidatorErrorProtocol =
  | AccountAlreadyActivatedError
  | CodeIsExpiredError
  | ConflictParamError
  | InactiveAccountError
  | InvalidCodeError
  | InvalidParamError
  | MissingParamError
  | UserCredentialError
