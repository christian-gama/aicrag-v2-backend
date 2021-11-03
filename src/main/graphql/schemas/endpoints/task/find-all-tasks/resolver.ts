/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeFindAllTasksController } from '@/main/factories/controllers/task'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Query: {
    findAllTasks: async (_, args, context) => await resolverAdapter(makeFindAllTasksController(), args, context)
  }
}
