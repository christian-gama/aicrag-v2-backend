/**
 * @description Interface used to create a log error.
 */
export interface ILogError {
  date: string
  message: string
  name: string
  stack: string | undefined
}
