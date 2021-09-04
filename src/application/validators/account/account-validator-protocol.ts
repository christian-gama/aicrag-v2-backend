export interface AccountValidator {
  validate: (input: any) => Error | undefined
}
