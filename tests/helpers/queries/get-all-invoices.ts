export const getAllInvoicesQuery = (query: {
  limit?: string
  page?: string
  sort?: string
  type: 'TX' | 'QA' | 'both'
}): string => `
  query {
    getAllInvoices(query: {
      ${query.limit ? `limit: "${query.limit}",` : ''}
      ${query.page ? `page: "${query.page}",` : ''}
      ${query.sort ? `sort: "${query.sort}",` : ''}
      type: "${query.type}"
    }) {
        count
        displaying
        page
        documents {
            date {
                month
                year
            }
            tasks
            totalUsd
        }
    }
  }
`
