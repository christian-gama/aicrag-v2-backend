Feature: Activate account

  To activate an account, the user must pass his email and the activation pin that he will receive through an email.
  The email must be sent through the SendWelcomeEmail endpoint.

  Rule: The user must be partially logged in into the system. The partial login is granted >once the user sign up or when he tries to login with an inactive account
  Rule: The input must be valid

    Scenario: Being not partially logged in
      Given I have an account with the following credentials:
        | email              | activationPin |
        | any_email@mail.com | 12345          |
      Given I am not partially logged in
      When I request to activate my account using the following credentials:
        | email              | activationPin |
        | any_email@mail.com | 12345          |
      Then I should receive an error message "Token is missing"
      And I must receive a status code of 401

    Scenario: Using a valid activation pin
      Given I have an account with the following credentials:
        | email              | activationPin |
        | any_email@mail.com | 12345          |
      Given I am partially logged in
      When I request to activate my account using the following credentials:
        | email              | activationPin |
        | any_email@mail.com | 12345          |
      Then I should have my account activated
      And I must receive a status code of 200

    Scenario: Using an invalid activation pin
      Given I have an account with the following credentials:
        | email              | activationPin |
        | any_email@mail.com | 12345          |
      Given I am partially logged in
      When I request to activate my account using the following credentials:
        | email              | activationPin |
        | any_email@mail.com | 54321          |
      Then I should receive an error message "Invalid pin"
      And I must receive a status code of 400
