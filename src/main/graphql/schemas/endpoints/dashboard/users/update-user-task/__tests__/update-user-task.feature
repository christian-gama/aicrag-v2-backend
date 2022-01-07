Feature: Update user task

  By passing an existent id, the user can update his task.

  Rule: The user must be logged in
  Rule: The taskId must be unique if different of empty string
  Rule: The input must be valid

    Scenario: Being logged out
      Given I am logged out
      When I try to update a task
      Then I should receive an error with message "É necessário um token"
      And I must receive a status code of 401

    Scenario: Being a common user
      Given I am a common user
      Given I am logged in
      When I try to update a task
      Then I should receive an error with message "Você não tem permissão"
      And I must receive a status code of 403

    Scenario: Using an existent task id
      Given I am an administrator
      Given I am logged in
      Given I already have a task with taskId of 1
      When I try to update a new task with the following data:
        | commentary     | date                     | duration | status    | taskId | type |
        | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   |
      Then I should receive an error with message "Parâmetro já existe: taskId"
      And I must receive a status code of 409

    Scenario Outline: Using an invalid input
      Given I am an administrator
      Given I have a task with ID of "40f2ac57-d994-4093-9e27-fea9e7d1ae8d"
      Given I am logged in
      When I try to update a new task of id "40f2ac57-d994-4093-9e27-fea9e7d1ae8d" with the following invalid data <commentary> <date> <duration> <status> <taskId> <type>
      Then I should receive an error with message of invalid param
      And I must receive a status code of 400

      Examples:
        | commentary     | date                     | duration | status    | taskId | type |
        | Any commentary | 2021-10-27T14:32:33.465Z | 100      | completed | 1      | TX   |
        | Any commentary | 2021-10-27T14:32:33.465Z | -100     | completed | 1      | TX   |
        | Any commentary | 2021-10-27T14:32:33.465Z | 5        | completed | 1      | QA   |
        | Any commentary | 2021-10-27T14:32:33.465Z | -5       | completed | 1      | QA   |

    Scenario Outline: Using a valid input
      Given I am an administrator
      Given I have a task with ID of "40f2ac57-d994-4093-9e27-fea9e7d1ae8d"
      Given I am logged in
      When I try to update a new task of id "40f2ac57-d994-4093-9e27-fea9e7d1ae8d" with the following valid data <commentary> <date> <duration> <status> <taskId> <type>
      Then I should have updated my task
      And I must receive a status code of 200

      Examples:
        | commentary     | date                     | duration | status    | taskId | type |
        | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   |
        | Any commentary | 2021-10-27T14:32:33.465Z | 1        | completed | 1      | TX   |
        | Any commentary | 2021-10-27T14:32:33.465Z | 2.5      | completed | 1      | QA   |
        | Any commentary | 2021-10-27T14:32:33.465Z | 1        | completed | 1      | QA   |
