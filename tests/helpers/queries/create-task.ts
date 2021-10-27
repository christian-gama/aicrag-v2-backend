export const createTaskMutation = (input: {
  commentary?: string
  date: Date
  duration: number
  status: 'completed' | 'in_progress'
  taskId?: string
  type: 'TX' | 'QA'
}): string => `
  mutation {
    createTask(input: {
      commentary: "${input.commentary ?? ''}",
      date: "${input.date.toISOString()}",
      duration: ${input.duration},
      status: "${input.status}",
      taskId: "${input.taskId ?? ''}",
      type: "${input.type}"
    }) {
        task {
            commentary
            date {
                full
                day
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
                    name
                    email
                    id
                }
                settings {
                    currency
                }
            }
        }
    }
  }
`
