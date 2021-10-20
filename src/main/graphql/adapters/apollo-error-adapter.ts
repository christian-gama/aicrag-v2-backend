import { ApolloError } from 'apollo-server-express'

export const apolloErrorAdapter = (message: string, statusCode: number, name: string): ApolloError => {
  class CustomApolloError extends ApolloError {
    constructor (message: string, extensions?: Record<string, any>) {
      super(message, statusCode.toString(), extensions)

      Object.defineProperty(this, 'name', { value: name })
    }
  }

  return new CustomApolloError(message)
}
