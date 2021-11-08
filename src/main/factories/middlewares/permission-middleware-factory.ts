import { IUser } from '@/domain'
import { PermissionMiddleware } from '@/presentation/middlewares'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware-protocol'
import { makeHttpHelper } from '../helpers'

export const makePermissionMiddleware = (permission: IUser['settings']['role']): IMiddleware => {
  const httpHelper = makeHttpHelper()

  switch (permission) {
    case 'administrator':
      return new PermissionMiddleware(httpHelper, 'administrator')
    case 'moderator':
      return new PermissionMiddleware(httpHelper, 'moderator')
    case 'user':
      return new PermissionMiddleware(httpHelper, 'user')
    case 'guest':
      return new PermissionMiddleware(httpHelper, 'guest')
  }
}
