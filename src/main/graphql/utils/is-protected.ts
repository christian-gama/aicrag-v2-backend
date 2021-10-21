import { apolloErrorAdapter } from '../adapters'

export const isProtected = (context: any): void => {
  const { isProtected } = context

  if (!isProtected || !isProtected.status) {
    throw apolloErrorAdapter(isProtected.data.message, 401, 'UnauthorizedError')
  }
}
