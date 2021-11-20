export const findAllUserTasksQuery = (
  param: { userId: string },
  query: { sort?: string, limit?: string, page?: string }
): string => `
  query {
    findAllUserTasks(param: { userId: "${param.userId}" }, query: {
      ${query.sort ? `sort: "${query.sort}",` : ''}
      ${query.limit ? `limit: "${query.limit}",` : ''}
      ${query.page ? `page: "${query.page}",` : ''} }) {
        count
        displaying
        page
        documents {
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
  }
`
