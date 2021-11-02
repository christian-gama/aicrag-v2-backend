Feature: Send email pin

  TAfter the user request an email update, this endpoint should be used to send the email code to the user email.

  Rule: The user must request UpdateUser endpoint first
  Rule: The input must be valid

    Scenario: Having a valid tempEmail
      Given I have an account with the following credentials:
        | email              | tempEmail          | tempEmailPin |
        | any_email@mail.com | new_email@mail.com | 12345        |
      When I request to send an email with my pin
      Then I should receive a message "An email with your pin has been sent to new_email@mail.com"
      And I must receive a status code of 200

    Scenario: Having an invalid tempEmail
      Given I have an account with the following credentials:
        | email              | tempEmail | tempEmailPin |
        | any_email@mail.com | null      | 12345        |
      When I request to send an email with my pin
      Then I should receive an error message "Credentials are invalid"
      And I must receive a status code of 400
