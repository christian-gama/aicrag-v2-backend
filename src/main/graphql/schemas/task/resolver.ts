/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { IUser } from '@/domain'

import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Task: {
    __isTypeOf: (obj) => {
      return obj.id !== undefined
    },
    commentary: ({ commentary }) => {
      return commentary
    },
    date: ({ date }) => {
      return date
    },
    duration: ({ duration }) => {
      return duration
    },
    id: ({ id }) => {
      return id
    },
    logs: ({ logs }) => {
      return logs
    },
    status: ({ status }) => {
      return status
    },
    taskId: ({ taskId }) => {
      return taskId
    },
    type: ({ type }) => {
      return type
    },
    usd: ({ usd }) => {
      return usd
    },
    user: async ({ user }, _, { userDataLoader }) => {
      const _user = (await userDataLoader.load(user as any)) as IUser

      return {
        __typename: 'PublicUser',
        personal: {
          email: _user.personal.email,
          id: _user.personal.id,
          name: _user.personal.name
        },
        settings: {
          currency: _user.settings.currency as any
        }
      }
    }
  }
}
