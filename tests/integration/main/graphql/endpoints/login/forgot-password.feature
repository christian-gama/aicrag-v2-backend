Feature: Forgot password

  If I forget my password, I should be able to recover my password using the forgot password

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
