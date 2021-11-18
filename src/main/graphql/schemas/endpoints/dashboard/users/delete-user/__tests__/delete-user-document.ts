export const deleteUserMutation = (param: { id: string }): string => `
  mutation {
    deleteUser (param: { id: "${param.id}" }) {
        message
    }
  }
`
