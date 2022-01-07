import { IUserRole } from '@/domain'
import { environment } from '@/main/config/environment'
import { createGraphqlSchema, handleError } from '@/main/graphql/utils'
import { protectedDirectiveTransformer, partialProtectedDirectiveTransformer } from '../directives'
import { permissionDirectiveTransformer } from '../directives/permission-directive'
import { context } from './context'
import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'

export default async (app: Express): Promise<ApolloServer> => {
  let schema = createGraphqlSchema()

  // The bottom schemas are executed first
  schema = permissionDirectiveTransformer(schema, IUserRole.administrator)
  schema = permissionDirectiveTransformer(schema, IUserRole.guest)
  schema = permissionDirectiveTransformer(schema, IUserRole.moderator)
  schema = permissionDirectiveTransformer(schema, IUserRole.user)
  schema = partialProtectedDirectiveTransformer(schema)
  schema = protectedDirectiveTransformer(schema)

  const server = new ApolloServer({
    context,
    plugins: [
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response, errors }) => handleError(response, errors)
        })
      }
    ],
    schema
  })

  await server.start()

  server.applyMiddleware({
    app,
    cors: { credentials: true, origin: ['https://studio.apollographql.com'] },
    path: environment.GRAPHQL.ENDPOINT
  })

  return server
}
