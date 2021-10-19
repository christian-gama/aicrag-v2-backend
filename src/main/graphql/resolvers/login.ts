import { makeLoginController } from '@/factories/controllers/login'

import { resolverAdapter } from '../adapters'

export default {
  Query: {
    login: async (parent: any, args: any) => await resolverAdapter(makeLoginController(), args)
  }
}
