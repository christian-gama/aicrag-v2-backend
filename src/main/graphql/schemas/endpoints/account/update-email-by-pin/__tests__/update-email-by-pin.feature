Feature: Update email by pin

  After the user request a patch in his email through UpdateUser endpoint, he can use the email pin sent to his new
  email to finally update his email.

  Rule: The user must be logged in
  Rule: The input must be valid

    Scenario: Being logged out
      Given The following temporaries:
        | tempEmail          | tempEmailPin |
        | any_email@mail.com | 12345        |
      Given I am logged out
      When I request to update my email using "12345"
      Then I should see an error that contains a message "Token is missing"
      And I must receive a status code of 401

    Scenario: Using a temporary valid pin
      Given The following temporaries:
        | tempEmail          | tempEmailPin |
        | any_email@mail.com | 12345        |
      Given I am logged in
      When I request to update my email using "12345"
      Then I should have my email updated
      And I should have my temporary email removed
      And I must receive a status code of 200

    Scenario: Using a temporary invalid pin
      Given The following temporaries:
        | tempEmail          | tempEmailPin |
        | any_email@mail.com | 12345        |
      Given I am logged in
      When I request to update my email using "54321"
      Then I should have receive an error that contains a message "Invalid pin"
      And I must receive a status code of 400

