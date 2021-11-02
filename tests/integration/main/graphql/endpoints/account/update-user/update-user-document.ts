export const updateUserMutation = (input: { currency?: 'BRL' | 'USD', email?: string, name?: string }): string => `
  mutation {
    updateUser(input: {
      ${input.currency ? `currency: ${input.currency},` : ''}
      ${input.email ? `email: "${input.email}",` : ''}
      ${input.name ? `name: "${input.name}"` : ''}
    }) {
        ... on UpdateUserHasChanges {
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
        ... on UpdateUserNoChanges {
            message
        }
    }
  }
`
