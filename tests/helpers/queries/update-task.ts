export const updateTaskMutation = (
  param: { id: string },
  input: {
    commentary?: string
    date: Date
    duration: number
    status: 'completed' | 'in_progress'
    taskId?: string
    type: 'TX' | 'QA'
  }
): string => `
  mutation {
    updateTask(
      param: { id: ${param.id} },
      input: {
        commentary: "${input.commentary ?? ''}",
        date: "${input.date.toString()}",
        duration: ${input.duration},
        status: "${input.status}",
        taskId: "${input.taskId ?? ''}",
        type: "${input.type}"
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
