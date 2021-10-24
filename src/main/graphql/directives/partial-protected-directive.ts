import { makePartialProtectedMiddleware } from '@/factories/middlewares'

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
              accessToken: context?.req?.cookies.accessToken
            }
          }

          const httpResponse = await makePartialProtectedMiddleware().handle(request)

          if (httpResponse.data.accessToken) return resolve?.call(this, parent, args, context, info)
          else throw apolloErrorAdapter('UnauthorizedError', httpResponse.data.message, 401)
        }
      }

      return fieldConfig
    }
  })
}
