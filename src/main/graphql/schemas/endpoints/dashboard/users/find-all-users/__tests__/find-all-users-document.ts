export const findAllUsersQuery = (query: {
  email?: string
  id?: string
  limit?: string
  name?: string
  page?: string
  role?: 'administrator' | 'user' | 'moderator' | 'guest'
  sort?: string
}): string => `
  query {
    findAllUsers(query: {
      ${query.email ? `email: "${query.email}",` : ''}
      ${query.id ? `id: "${query.id}",` : ''}
      ${query.limit ? `limit: "${query.limit}",` : ''}
      ${query.name ? `name: "${query.name}",` : ''}
      ${query.page ? `page: "${query.page}",` : ''}
      ${query.role ? `role: ${query.role},` : ''}
      ${query.sort ? `sort: "${query.sort}",` : ''}
      }) {
        count
        displaying
        documents {
            logs {
                createdAt
                lastLoginAt
                lastSeenAt
                updatedAt
            }
            personal {
                email
                id
                name
                password
            }
        }
        page
    }
  }
`
