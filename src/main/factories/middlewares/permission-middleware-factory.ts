import { IUserRole } from '@/domain'
import { PermissionMiddleware } from '@/presentation/middlewares'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware.model'
import { makeTryCatchDecorator } from '../decorators'
import { makeHttpHelper } from '../helpers'

export const makePermissionMiddleware = (permission: IUserRole): IMiddleware => {
  const httpHelper = makeHttpHelper()

  switch (permission) {
    case IUserRole.administrator:
      return makeTryCatchDecorator(new PermissionMiddleware(httpHelper, IUserRole.administrator))
    case IUserRole.moderator:
      return makeTryCatchDecorator(new PermissionMiddleware(httpHelper, IUserRole.moderator))
    case IUserRole.user:
      return makeTryCatchDecorator(new PermissionMiddleware(httpHelper, IUserRole.user))
    case IUserRole.guest:
      return makeTryCatchDecorator(new PermissionMiddleware(httpHelper, IUserRole.guest))
  }
}
