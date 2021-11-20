Feature: Find all user tasks

  Find all tasks from the user. Supports filtering.

  Rule: The user must be logged in
  Rule: Must be an administrator

    Scenario: Being logged out
      Given I am logged out
      When I try to find all tasks:
      Then I should receive an error with message "Token is missing"
      And I must receive a status code of 401

    Scenario: Being a common user
      Given I am a common user
      Given I am logged in
      When I try to find all tasks
      Then I should receive an error with message "You have no permission"
      And I must receive a status code of 403

    Scenario: Having existent tasks
      Given I have the following tasks:
        | commentary     | date                     | duration | status    | taskId | type |
        | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   |
        | Any commentary | 2021-10-24T15:12:38.773Z | 30       | completed | 2      | TX   |
        | Any commentary | 2021-09-15T08:41:54.351Z | 30       | completed | 3      | TX   |
        | Any commentary | 2021-08-19T07:11:15.912Z | 30       | completed | 4      | TX   |
        | Any commentary | 2021-08-31T23:59:59.999Z | 2.4      | completed | 5      | QA   |
        | Any commentary | 2022-01-01T00:00:00.000Z | 15       | completed | 6      | TX   |
      Given I am logged in
      When I try to find all tasks
      Then I should get the following tasks:
        | commentary     | date                     | duration | status    | taskId | type | usd   |
        | Any commentary | 2022-01-01T00:00:00.000Z | 15       | completed | 6      | TX   | 16.25 |
        | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   | 32.5  |
        | Any commentary | 2021-10-24T15:12:38.773Z | 30       | completed | 2      | TX   | 32.5  |
        | Any commentary | 2021-09-15T08:41:54.351Z | 30       | completed | 3      | TX   | 32.5  |
        | Any commentary | 2021-08-31T23:59:59.999Z | 2.4      | completed | 5      | QA   | 4.5   |
        | Any commentary | 2021-08-19T07:11:15.912Z | 30       | completed | 4      | TX   | 32.5  |
      And I must receive a status code of 200

    Scenario: Getting all tasks using filters
      Given I have the following tasks:
        | commentary     | date                     | duration | status    | taskId | type |
        | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   |
        | Any commentary | 2021-10-24T15:12:38.773Z | 30       | completed | 2      | TX   |
        | Any commentary | 2021-09-15T08:41:54.351Z | 30       | completed | 3      | TX   |
        | Any commentary | 2021-08-19T07:11:15.912Z | 30       | completed | 4      | TX   |
        | Any commentary | 2021-08-31T23:59:59.999Z | 2.4      | completed | 5      | QA   |
        | Any commentary | 2022-01-01T00:00:00.000Z | 15       | completed | 6      | TX   |
      Given I am logged in
      When I try to find all tasks limiting the results by "1"
      Then I should get the following tasks:
        | commentary     | date                     | duration | status    | taskId | type | usd   |
        | Any commentary | 2022-01-01T00:00:00.000Z | 15       | completed | 6      | TX   | 16.25 |
        | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   | 32.5  |
        | Any commentary | 2021-10-24T15:12:38.773Z | 30       | completed | 2      | TX   | 32.5  |
        | Any commentary | 2021-09-15T08:41:54.351Z | 30       | completed | 3      | TX   | 32.5  |
        | Any commentary | 2021-08-31T23:59:59.999Z | 2.4      | completed | 5      | QA   | 4.5   |
        | Any commentary | 2021-08-19T07:11:15.912Z | 30       | completed | 4      | TX   | 32.5  |
      And The displaying count should be "1"
      And The amount page should be "1 of 6"
      And I must receive a status code of 200
