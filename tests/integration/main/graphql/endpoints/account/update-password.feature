Feature: Update password

    I should be able to update my password.

    Rule: A password must have at least 8 characters and a maximum of 32 characters.

      Scenario: Requesting to update my password being logged out
        Given My current password is "12345678"
        Given I am logged out
        When I request to update my password with the following valid input:
          | currentPassword | password | passwordConfirmation |
          |        12345678 | 87654321 |             87654321 |
        Then I should see an error that contains a message "Token is missing"
        And I must receive a status code of 401

      Scenario: Requesting to update my password with correct input
        Given My current password is "12345678"
        Given I am logged in
        When I request to update my password with the following valid input:
          | currentPassword | password | passwordConfirmation |
          |       12345678  | 87654321 |             87654321 |
        Then I should have my password updated
        And I should have my temporary email removed
        And I must receive a status code of 200

      Scenario: Requesting to update my password with correct invalid current password
        Given My current password is "12345678"
        Given I am logged in
        When I request to update my password with the following invalid current password:
          | currentPassword | password | passwordConfirmation |
          |        12121212 | 87654321 |             87654321 |
        Then I should receive an error with a message "Credentials are invalid"
        And I must receive a status code of 400


      Scenario: Requesting to update my email using an invalid password
        Given My current password is "12345678"
        Given I am logged in
        When I request to update my password with the following invalid passwords:
          | currentPassword | password | passwordConfirmation |
          |        12345678 |      123 |                  123 |
        Then I should receive an error with a message "Invalid param: password"
        And I must receive a status code of 400

