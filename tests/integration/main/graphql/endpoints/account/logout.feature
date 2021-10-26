Feature: Logout

    I must logout of the application after requesting it.

    Scenario: Requesting to logout being logged in
        Given I am logged in
        When I request to logout
        Then I should see a message that I says "You've been logged out"
        And I should have my tokenVersion incremented by 1
        And I must receive a status code of 200


    Scenario: Requesting to logout being logged out
        Given I am logged out
        When I request to logout
        Then I should see an error that contains the "Token is missing"
        And I must receive a status code of 401
