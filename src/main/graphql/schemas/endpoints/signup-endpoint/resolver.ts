import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeSignUpController } from '@/factories/controllers/signup'

export const resolver: Resolvers = {
  Mutation: {
    signUp: async (_, args, context) => await apolloControllerAdapter(makeSignUpController(), args, context)
  }
}
