Feature: Update email by code

    I should be able to update my email using a temporary email code.

    Scenario: Requesting to update my email being logged out
    Given I am logged out
    When I request to update my email
    Then I should see an error that contains a message "Token is missing"
    And I must receive a status code of 401

    # Scenario: Requesting to update my email using a temporary valid code
    #     Given I am logged in
    #     When I request to logout
    #     Then I should see a message that I says "You've been logged out"
    #     And I should have my tokenVersion incremented by 1
    #     And I must receive a status code of 200


    # Scenario: Requesting to update my email using a temporary invalid code
    #     Given I am logged out
    #     When I request to logout
    #     Then I should see an error that contains a message "Token is missing"
    #     And I must receive a status code of 401


