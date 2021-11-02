Feature: Verify reset password token

  Validate the reset password token to grant partial access to the user, allowing him to reset his password.

  Rule: The user must be logged out;
  Rule: The param must be valid.

    Scenario: Being logged in
      Given I am logged in
      When I try to verify my token
      Then I should receive an error with message "You must logout first"
      And I must receive a status code of 403

    Scenario: Using an invalid token
      Given I am logged out
      When I try to verify my token using an invalid token
      Then I should receive an error with message "Token is invalid"
      And I must receive a status code of 401

    Scenario: Using a valid token
      Given I am logged out
      Given I have a valid resetPasswordToken
      When I try to verify my token using a valid token
      Then I should get an access token
      And I must receive a status code of 200
