/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeFindOneTaskController } from '@/factories/controllers/task'

export const resolver: Resolvers = {
  Query: {
    findOneTask: async (_, args, context) => await resolverAdapter(makeFindOneTaskController(), args, context)
  }
}
