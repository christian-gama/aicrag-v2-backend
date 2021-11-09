import { IUserRole } from '@/domain'
import { makePermissionMiddleware } from '@/main/factories/middlewares/permission-middleware-factory'
import { apolloErrorAdapter } from '../adapters'
import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

export const permissionDirectiveTransformer = (schema: GraphQLSchema, permission: IUserRole): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      let permissionStr = ''

      switch (permission) {
        case IUserRole.administrator:
          permissionStr = 'administrator'
          break
        case IUserRole.moderator:
          permissionStr = 'moderator'
          break
        case IUserRole.user:
          permissionStr = 'user'
          break
        case IUserRole.guest:
          permissionStr = 'guest'
          break
      }

      const permissionDirective = getDirective(schema, fieldConfig, permissionStr)

      if (permissionDirective) {
        const { resolve } = fieldConfig

        fieldConfig.resolve = async (parent, args, context, info) => {
          const request = {
            user: context?.req.user
          }

          const httpResponse = await makePermissionMiddleware(permission).handle(request)

          if (httpResponse.status) return resolve?.call(this, parent, args, context, info)
          else throw apolloErrorAdapter('ForbiddenError', httpResponse.data.message, 403)
        }
      }

      return fieldConfig
    }
  })
}
