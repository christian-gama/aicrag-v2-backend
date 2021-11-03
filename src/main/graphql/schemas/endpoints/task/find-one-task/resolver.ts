/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeFindOneTaskController } from '@/main/factories/controllers/task'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Query: {
    findOneTask: async (_, args, context) => await resolverAdapter(makeFindOneTaskController(), args, context)
  }
}
