/**
 * @description Interface used to create a log error.
 */
export interface ILogError {
  name: string
  date: string
  message: string
  stack: string | undefined
}
