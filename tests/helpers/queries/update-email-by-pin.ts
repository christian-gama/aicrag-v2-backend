export const updateEmailByPinMutation = (input: { emailPin: string }): string => `
  mutation {
    updateEmailByPin (input: { emailPin: "${input.emailPin}" }) {
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
`
