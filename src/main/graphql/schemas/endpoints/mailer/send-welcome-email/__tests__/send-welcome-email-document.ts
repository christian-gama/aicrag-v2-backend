export const sendWelcomeEmailMutation = (input: { email: string }): string => `
  mutation {
    sendWelcomeEmail(input: { email: "${input.email}" }) {
        message
    }
  }
`
