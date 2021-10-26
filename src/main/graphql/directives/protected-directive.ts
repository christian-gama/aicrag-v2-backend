import { environment } from '@/main/config/environment'

import { makeProtectedMiddleware } from '@/factories/middlewares'

import { apolloErrorAdapter } from '../adapters'

import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

export const protectedDirectiveTransformer = (schema: GraphQLSchema): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const protectedDirective = getDirective(schema, fieldConfig, 'protected')

      if (protectedDirective) {
        const { resolve } = fieldConfig

        fieldConfig.resolve = async (parent, args, context, info) => {
          const request = {
            cookies: {
              accessToken: context?.req?.cookies?.accessToken,
              refreshToken: context?.req?.cookies?.refreshToken
            },
            headers: {
              'x-access-token': context?.req?.headers?.['x-access-token'],
              'x-refresh-token': context?.req?.headers?.['x-refresh-token']
            }
          }

          const httpResponse = await makeProtectedMiddleware().handle(request)

          if (httpResponse.data.refreshToken) {
            context?.res?.cookie('accessToken', httpResponse.data.accessToken, {
              httpOnly: true,
              secure: environment.SERVER.NODE_ENV === 'production'
            })

            context.req.headers['x-access-token'] = httpResponse.data.accessToken
            context.req.cookies.accessToken = httpResponse.data.accessToken

            return resolve?.call(this, parent, args, context, info)
          } else {
            throw apolloErrorAdapter('UnauthorizedError', httpResponse.data.message, 401)
          }
        }
      }

      return fieldConfig
    }
  })
}
