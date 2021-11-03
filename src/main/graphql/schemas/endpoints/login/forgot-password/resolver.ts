/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeForgotPasswordController } from '@/main/factories/controllers/login'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    forgotPassword: async (_, args, context) => await resolverAdapter(makeForgotPasswordController(), args, context)
  }
}
