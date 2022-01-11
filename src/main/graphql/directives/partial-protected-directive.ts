import { environment } from '@/main/config/environment'
import { makePartialProtectedMiddleware } from '@/main/factories/middlewares'
import { apolloErrorAdapter } from '../adapters'
import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

export const partialProtectedDirectiveTransformer = (schema: GraphQLSchema): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const protectedDirective = getDirective(schema, fieldConfig, 'partialProtected')

      if (protectedDirective) {
        const { resolve } = fieldConfig

        fieldConfig.resolve = async (parent, args, context, info) => {
          const request = {
            cookies: {
              accessToken: context?.req?.cookies?.accessToken
            },
            headers: {
              'x-access-token': context?.req?.headers?.['x-access-token']
            }
          }

          const httpResponse = await makePartialProtectedMiddleware().handle(request)

          if (httpResponse.data.accessToken) {
            context?.res?.cookie('accessToken', httpResponse.data.accessToken, {
              httpOnly: true,
              secure: environment.SERVER.NODE_ENV === 'production'
            })

            context?.res?.setHeader('x-access-token', httpResponse.data.accessToken)

            return resolve?.call(this, parent, args, context, info)
          } else {
            context?.res?.setHeader('x-access-token', '')
            context?.res?.clearCookie('accessToken')
            throw apolloErrorAdapter('UnauthorizedError', httpResponse.data.message, 401)
          }
        }
      }

      return fieldConfig
    }
  })
}
