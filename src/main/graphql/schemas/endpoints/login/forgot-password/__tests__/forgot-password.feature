Feature: Forgot password

  If the user forgot his password, he can request a token that will be sent to his email and then use the valid
  token to reset his password. After getting a valid token, it must be used in the VerifyResetPasswordToken endpoint,
  which will grant a partial access to the user, allowing him to reset his password using the ResetPassword endpoint.
  The email must be sent through the SendForgotPasswordEmail endpoint.

  Rule: User must be logged out
  Rule: The input must be valid

    Scenario: Being logged in
      Given I am logged in
      When I request to reset my password using the email "any_email@mail.com"
      Then I should receive an error message "You must logout first"
      And I must receive a status code of 403

    Scenario: Using a valid email
      Given I have an account with the email "any_email@mail.com"
      Given I am logged out
      When I request to reset my password using the email "any_email@mail.com"
      Then I should have my resetPasswordToken updated to a new token
      And I must receive a status code of 200

    Scenario: Using an invalid email
      Given I have an account with the email "any_email@mail.com"
      Given I am logged out
      When I request to reset my password using the email "invalid_email@mail.com"
      Then I should receive an error message "Credentials are invalid"
      And I must receive a status code of 400
