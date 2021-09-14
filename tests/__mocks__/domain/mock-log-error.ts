import { LogErrorProtocol } from '@/domain/log/log-error-protocol'

export const makeFakeLogError = (error: Error): LogErrorProtocol => {
  return {
    name: error.name,
    date: new Date(Date.now()).toLocaleString(),
    message: error.message,
    stack: error.stack
  }
}
