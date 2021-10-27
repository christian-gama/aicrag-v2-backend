Feature: Update user

    I should be able to update my currency, email or name.

      Scenario: Requesting to update me being logged out
        Given I am logged out
        When I request to update me with the following input:
        | Currency |              Email |     Name |
        |      BRL | new_email@mail.com | New Name |
        Then I should see an error that contains a message "Token is missing"
        And I must receive a status code of 401

      Scenario: Requesting to update my currency
        Given I am logged in
        When I request to update my currency settings with "BRL"
        Then I should have my currency updated to "BRL"
        And I must receive a status code of 200
