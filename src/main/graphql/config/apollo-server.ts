import resolvers from '../resolvers'
import typeDefs from '../type-defs'

import { ApolloServer } from 'apollo-server-express'

export default (): ApolloServer => {
  return new ApolloServer({
    resolvers,
    typeDefs
  })
}
