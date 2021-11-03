/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeResetPasswordController } from '@/main/factories/controllers/login'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    resetPassword: async (_, args, context) => await resolverAdapter(makeResetPasswordController(), args, context)
  }
}
