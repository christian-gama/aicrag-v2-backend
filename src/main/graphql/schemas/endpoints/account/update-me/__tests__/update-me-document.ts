export const updateMeMutation = (input: { currency?: 'BRL' | 'USD', email?: string, name?: string }): string => `
  mutation {
    updateMe(input: {
      ${input.currency ? `currency: ${input.currency},` : ''}
      ${input.email ? `email: "${input.email}",` : ''}
      ${input.name ? `name: "${input.name}"` : ''}
    }) {
        ... on UpdateMeHasChanges {
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
        ... on UpdateMeNoChanges {
            message
        }
    }
  }
`
