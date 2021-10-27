export const updateEmailByCodeMutation = (input: { emailCode: string }): string => `
  mutation {
    updateEmailByCode (input: { emailCode: "${input.emailCode}" }) {
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
