import { makeSignUpController } from '@/main/factories/controllers/signup'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    signUp: async (_, args, context) => await resolverAdapter(makeSignUpController(), args, context)
  }
}
