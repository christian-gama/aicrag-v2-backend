Feature: Send recover password email

  After the user request the forgot password endpoint, this endpoint should be used to send the reset password token to the user email.

  Rule: The user must request ForgotPassword endpoint first
  Rule: The input must be valid

    Scenario: Having a valid email
      Given I have an account with the an email "any_email@mail.com" and a valid resetPasswordToken
      When I request to send an email using my existent email
      Then I should receive a message "Instructions to reset your password were sent to any_email@mail.com"
      And I must receive a status code of 200

    Scenario: Having an invalid email
      Given I have an account with the an email "any_email@mail.com" and a valid resetPasswordToken
      When I request to send an email using an invalid email "invalid_email@mail.com"
      Then I should receive an error message "Credentials are invalid"
      And I must receive a status code of 400

    Scenario: Having an invalid resetPasswordToken
      Given I have an account with the an email "any_email@mail.com" and an invalid resetPasswordToken
      When I request to send an email using my existent email
      Then I should receive an error message "Missing param: resetPasswordToken"
      And I must receive a status code of 400
