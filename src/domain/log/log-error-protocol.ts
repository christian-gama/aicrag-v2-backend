/**
 * @description Interface used to create a log error.
 */
export interface LogError {
  name: string
  date: string
  message: string
  stack: string | undefined
}
