import { createGraphqlSchema, handleErrors } from '@/main/graphql/utils'

import { context } from '../context'

import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'

export default async (app: Express): Promise<ApolloServer> => {
  const schema = createGraphqlSchema()

  const server = new ApolloServer({
    context,
    plugins: [
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response, errors }) => handleErrors(response, errors)
        })
      }
    ],
    schema
  })

  await server.start()

  server.applyMiddleware({
    app,
    cors: { credentials: true, origin: 'https://studio.apollographql.com' },
    path: '/graphql'
  })

  return server
}
