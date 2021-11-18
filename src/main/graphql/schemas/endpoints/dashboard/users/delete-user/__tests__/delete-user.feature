Feature: Delete user

  The administrator can delete a user.

  Rule: Only administrators can delete a user
  Rule: A administrator cannot delete the account of another administrator, neither his own account
  Rule: The user should be deleted using his ID
  Rule: Must be logged in

    Scenario: Being logged out
      Given I am logged out
      When I try to update a user
      Then I should receive an error with message "Token is missing"
      And I must receive a status code of 401

    Scenario: Being a common user
      Given I am a common user
      Given I am logged in
      When I try to delete a user
      Then I should receive an error with message "You have no permission"
      And I must receive a status code of 403

    Scenario: Trying to delete myself
      Given I am an administrator
      Given I am logged in
      When I try to delete myself
      Then I should receive an error with message "You cannot delete yourself"
      And I must receive a status code of 403

    Scenario: Trying to delete the account of another administrator
      Given I am an administrator
      Given I am logged in
      Given There is another administrator
      When I try to delete the account of another administrator
      Then I should receive an error with message "You cannot delete an administrator"
      And I must receive a status code of 403

    Scenario: Trying to delete the account of a user being an administrator
      Given I am an administrator
      Given I am logged in
      Given There is a user
      When I try to delete the account of a user
      Then The user should be deleted
      And I must receive a status code of 200


