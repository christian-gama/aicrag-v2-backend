/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeUpdateTaskController } from '@/factories/controllers/task'

export const resolver: Resolvers = {
  Mutation: {
    updateTask: async (_, args, context) => await resolverAdapter(makeUpdateTaskController(), args, context)
  },
  UpdateTaskHasChanges: {
    __isTypeOf: (obj) => {
      return obj.task !== undefined
    }
  },
  UpdateTaskNoChanges: {
    __isTypeOf: (obj) => {
      return obj.message !== undefined
    }
  }
}
