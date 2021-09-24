import { ILogError } from '@/domain/log/log-error-protocol'

export const makeFakeLogError = (error: Error): ILogError => {
  return {
    date: new Date(Date.now()).toLocaleString(),
    message: error.message,
    name: error.name,
    stack: error.stack
  }
}
