export const findOneTaskQuery = (param: { id: string }): string => `
  query {
    findOneTask(param: { id: "${param.id}" }) {
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
  }
`
