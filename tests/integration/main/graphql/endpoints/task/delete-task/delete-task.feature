Feature: Delete task

  Delete a task using an existent id.

  Rule: The user must be logged in
  Rule: The param must be valid

    Scenario: Being logged out
      Given I have an existent task with the id "2be197f2-52e7-465e-806f-3f682dcf033d"
      Given I am logged out
      When I try to delete a task with the id "2be197f2-52e7-465e-806f-3f682dcf033d":
      Then I should receive an error with message "Token is missing"
      And I must receive a status code of 401

    Scenario: Using an invalid ID
      Given I have an existent task with the id "2be197f2-52e7-465e-806f-3f682dcf033d"
      Given I am logged in
      When I try to delete a task with the id "de0df9c2-6431-4083-bd9b-121fc0d84fa9":
      Then I should receive an error with message "No tasks were found"
      And I must receive a status code of 400

    Scenario: Using a valid ID
      Given I have an existent task with the id "2be197f2-52e7-465e-806f-3f682dcf033d"
      Given I am logged in
      When I try to delete a task with the id "2be197f2-52e7-465e-806f-3f682dcf033d":
      Then I should receive success message "Content deleted"
      And I must receive a status code of 200
