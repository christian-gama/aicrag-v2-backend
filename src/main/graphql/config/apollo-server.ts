import resolvers from '../resolvers'
import typeDefs from '../type-defs'

import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'

export default (app: Express): void => {
  const server = new ApolloServer({
    resolvers,
    typeDefs
  })
  server.applyMiddleware({ app })
}
