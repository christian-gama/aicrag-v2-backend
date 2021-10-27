export const getInvoiceByMonthQuery = (query: {
  limit?: string
  month: string
  page?: string
  sort?: string
  type: 'QA' | 'TX' | 'both'
  year: string
}): string => `
  query {
    getInvoiceByMonth(query: {
      ${query.limit ? `limit: "${query.limit}",` : ''}
      ${query.page ? `page: "${query.page}",` : ''}
      ${query.sort ? `sort: "${query.sort}",` : ''}
      month: "${query.month}",
      year: "${query.year}",
      type: "${query.type}"
    }) {
        count
        displaying
        documents {
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
        page
    }
  }
`
