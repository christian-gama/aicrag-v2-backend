import { createGraphqlSchema, handleErrors } from '@/main/graphql/utils'

import { ApolloServer } from 'apollo-server-express'

export default async (app): Promise<ApolloServer> => {
  const schema = createGraphqlSchema()

  const server = new ApolloServer({
    context: ({ req }) => ({ req }),
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
  server.applyMiddleware({ app, path: '/graphql' })

  return server
}
