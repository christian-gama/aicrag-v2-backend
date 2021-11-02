export const deleteTaskMutation = (param: { id: string }): string => `
  mutation {
    deleteTask(param: { id: "${param.id}" }) {
        message
    }
  }
`
