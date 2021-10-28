Feature: Send welcome email

  Upon an account creation, this endpoint should be used to send the activation code to the user email.

  Rule: The user must create an account first
  Rule: TThe input must be valid

    Scenario: Having a valid email
      Given I have an account with the an email "any_email@mail.com"
      When I request to send an email using my existent email
      Then I should receive a message "A welcome email with activation pin has been sent to any_email@mail.com"
      And I must receive a status code of 200

    Scenario: Having an invalid email
      Given I have an account with the an email "any_email@mail.com"
      When I request to send an email using an invalid email "invalid_email@mail.com"
      Then I should receive an error message "Credentials are invalid"
      And I must receive a status code of 400
