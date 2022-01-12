![Build Status](https://github.com/christian-gama/aicrag-v2-backend/actions/workflows/main.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/christian-gama/aicrag-v2-backend/badge.svg?branch=master)](https://coveralls.io/github/christian-gama/aicrag-v2-backend?branch=master)

# Welcome to my first personal project: Aicrag (backend)

The purpose of this project is to save monthly invoices from a transcription project. It is possible to save the amount of money you earn per each task and keep your records saved. The project can also have Quality Assurance, besides the Transcriptionist, so it is also possibile to save the records for QAs.
This project contains: signup, signin, account confirmation, password recovery and much more. This is a refactor from my previous version, which did not have Clean Architecture.

As this is my first personal project ever, you may find some stuffs that you disagree, but hey, I am learning! Feel free to contact me to appoint mistakes you found or any feedbacks! 😅

## [API Documentation](https://documenter.getpostman.com/view/16405037/UV5aeFVE)

> ### Principles I've used

- Composition Over Inheritance
- Dependency Inversion Principle (DIP)
- Don't Repeat Yourself (DRY)
- Interface Segregation Principle (ISP)
- Keep It Simple, Silly (KISS)
- Liskov Substitution Principle (LSP)
- Open Closed Principle (OCP)
- Separation of Concerns (SOC)
- Single Responsibility Principle (SRP)
- Small Commits
- You Aren't Gonna Need It (YAGNI)

> ### Methodologies I've used

- Behavior Driven Development (BDD)
- Clean Architecture
- Continuous Integration
- Conventional Commits
- Domain-Driven Design (DDD)
- GitFlow
- Modular Design
- Test-driven development (TDD)
- Use Cases

> ### Design patterns I've used

- Adapter
- Composite
- Decorator
- Dependency Injection
- Factory

> ### Libraries and tools I've used

- Apollo Server Express
- Bcrypt
- Cookie Parser
- CORS
- Docker
- dotenv
- Eslint
- Express
- Express Rate Limit
- Faker
- GraphQL
- Helmet
- HTML to Text
- Husky
- Jest
- JsonWebToken
- Lint Staged
- MockDate
- MongoDb
- Nodemailer
- Prettier
- PUG
- Rimraf
- Supertest
- Typescript
- Validator
- YARN

# Getting started

Make sure you set the environment variables before running the following instructions.

> ### Installing dependencies
>
> `$ yarn install`

---

> ### Running locally
>
> If you want to run this server locally, just run:

`$ yarn dev:local`

It will run on port 4001 as default.

---

> ### Running in a Docker environment (Must have Docker installed)
>
> If you want to run this server in a Docker environment, just run:

`$ yarn docker:up`

It will run on port 4000 as default.

---

> ### Fixing a permission error caused on Linux by Docker
>
> When docker maps a ./data folder from mongo, it will cause a permission error on Linux

`$ sudo chmod 777 -R data`

