import { apolloResponseAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeSignUpController } from '@/factories/controllers/signup'

export const resolver: Resolvers = {
  Mutation: {
    signUp: async (_, { input }) => await apolloResponseAdapter(makeSignUpController(), input)
  }
}