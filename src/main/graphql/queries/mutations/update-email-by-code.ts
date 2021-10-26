export const updateEmailByCodeMutation = (emailCode: string): string => `
mutation {
  updateEmailByCode (input: { emailCode: "${emailCode}" }) {
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
