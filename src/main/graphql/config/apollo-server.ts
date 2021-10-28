import { environment } from '@/main/config/environment'
import { createGraphqlSchema, handleError } from '@/main/graphql/utils'

import { protectedDirectiveTransformer, partialProtectedDirectiveTransformer } from '../directives'
import { context } from './context'

import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'

export default async (app: Express): Promise<ApolloServer> => {
  let schema = createGraphqlSchema()
  schema = protectedDirectiveTransformer(schema)
  schema = partialProtectedDirectiveTransformer(schema)

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
    cors: { credentials: true, origin: 'https://studio.apollographql.com' },
    path: environment.GRAPHQL.ENDPOINT
  })

  return server
}
