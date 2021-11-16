Feature: Update user by id

  The administrator should be able to update the user data.

  Rule: Only administrator have permission to update a user
  Rule: A administrator cannot change his permission to a lower permission
  Rule: Must be logged in

    Scenario: Being logged out
      Given I am logged out
      When I try to update a user
      Then I should receive an error with message "Token is missing"
      And I must receive a status code of 401

    Scenario: Being a common user
      Given I am a common user
      Given I am logged in
      When I try to update a user
      Then I should receive an error with message "You have no permission"
      And I must receive a status code of 403

    Scenario: Trying to update the administrators permission to a lower permission
      Given I am an administrator
      Given I am logged in
      When I try to update my perimssion to a lower permission
      Then I should receive an error with message "You have no permission"
      And I must receive a status code of 403

    Scenario: Updating a user being an administrator
      Given I am an administrator
      Given I am logged in
      Given There is a user in the database
      When I try to update a user
      Then The user should be updated
      And I must receive a status code of 200
