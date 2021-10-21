/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
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
    userId: ({ userId }) => {
      return userId
    }
  }
}
