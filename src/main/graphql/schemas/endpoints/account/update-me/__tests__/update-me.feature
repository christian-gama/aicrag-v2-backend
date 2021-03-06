Feature: Update user

  The user can change his currency, email and/or name. After requesting an email patch, the user must confirm his new
  email using the email pin sent to his email through SendEmailPin endpoint, however the name and currency are
  updated instantly.

  Rule: The user must be logged in
  Rule: The input must be valid

    Scenario: Being logged out
      Given I am logged out
      When I request to update me with the following input:
        | currency | email              | name     |
        | BRL      | new_email@mail.com | New Name |
      Then I should see an error that contains a message "É necessário um token"
      And I must receive a status code of 401

    Scenario: Updating only currency
      Given I am logged in
      When I request to update my currency settings with "BRL"
      Then I should have my currency updated to "BRL"
      And I must receive a status code of 200

    Scenario: Updating only email using a valid email
      Given I am logged in
      When I request to update my email with "new_email@mail.com"
      Then I should have my temporary email set to "new_email@mail.com"
      And I should have my temporary email code set to a random code
      And I should have my temporary email code expiration set to expire in 10 minutes
      And I must receive a status code of 200

    Scenario: Updating only email using an invalid email
      Given I am logged in
      When I request to update my email with "invalid@email"
      Then I should receive an error that contains a message "Parâmetro inválido: email"
      And I must receive a status code of 400

    Scenario: Updating only name using a valid name
      Given I am logged in
      When I request to update my name with "New Name"
      Then I should have my name set to "New Name"
      And I must receive a status code of 200

    Scenario: Updating only name using an invalid name
      Given I am logged in
      When I request to update my name with "Invalid_Name"
      Then I should receive an error that contains a message "Parâmetro inválido: name"
      And I must receive a status code of 400
