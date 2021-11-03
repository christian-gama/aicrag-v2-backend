/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeCreateTaskController } from '@/main/factories/controllers/task'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    createTask: async (_, args, context) => await resolverAdapter(makeCreateTaskController(), args, context)
  }
}
