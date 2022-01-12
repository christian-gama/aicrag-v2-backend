import _helmet from 'helmet'

export const helmet = _helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' ? undefined : false
})
