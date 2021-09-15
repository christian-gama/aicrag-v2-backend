import { LogError } from '@/domain/log/log-error-protocol'

export const makeFakeLogError = (error: Error): LogError => {
  return {
    name: error.name,
    date: new Date(Date.now()).toLocaleString(),
    message: error.message,
    stack: error.stack
  }
}
