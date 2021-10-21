import { apolloErrorAdapter } from '../adapters'

export const isPartialProtected = (context: any): void => {
  const { isPartialProtected } = context

  if (!isPartialProtected || !isPartialProtected.status) {
    throw apolloErrorAdapter(isPartialProtected.data.message, 401, 'UnauthorizedError')
  }
}
