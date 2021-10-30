export const updateTaskMutation = (
  param: { id: string },
  input: {
    commentary?: string
    date?: Date
    duration?: number
    status?: 'completed' | 'in_progress'
    taskId?: string
    type?: 'TX' | 'QA'
  }
): string => `
  mutation {
    updateTask(
      param: { id: "${param.id}" },
      input: {
        ${input.commentary ? `commentary: "${input.commentary}",` : ''}
        ${input.date ? `date: "${input.date.toString()}",` : ''}
        ${input.duration ? `duration: ${input.duration},` : ''}
        ${input.status ? `status: ${input.status},` : ''}
        ${input.taskId ? `taskId: "${input.taskId}",` : ''}
        ${input.type ? `type: ${input.type}` : ''}
      }) {
        ... on UpdateTaskHasChanges {
            task {
                commentary
                date {
                    day
                    full
                    hours
                    month
                    year
                }
                duration
                id
                logs {
                    createdAt
                    updatedAt
                }
                status
                taskId
                type
                usd
                user {
                    personal {
                        email
                        id
                        name
                    }
                    settings {
                        currency
                    }
                }
            }
        }
        ... on UpdateTaskNoChanges {
            message
        }
    }
  }
`
