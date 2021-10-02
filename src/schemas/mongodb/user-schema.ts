/* eslint-disable sort-keys */
import { MongoAdapter } from '../../infra/adapters/database/mongodb'

export const CreateUserSchema = async (): Promise<any> => {
  await MongoAdapter.client
    .db()
    .listCollections({ name: 'users' })
    .next(async (err: Error, collInfo: any) => {
      if (err) console.log(err)
      if (!collInfo) {
        try {
          await MongoAdapter.client.db().createCollection('users', {
            validator: {
              $jsonSchema: {
                bsonType: 'object',
                required: ['logs', 'personal', 'settings', 'temporary'],
                properties: {
                  logs: {
                    bsonType: 'object',
                    required: ['createdAt', 'lastLoginAt', 'lastSeenAt', 'updatedAt'],
                    properties: {
                      createdAt: {
                        bsonType: 'date',
                        description: 'must be a date or null and is required'
                      },
                      lastLoginAt: {
                        bsonType: ['date', 'null'],
                        description: 'must be a date or null and is required'
                      },
                      lastSeenAt: {
                        bsonType: ['date', 'null'],
                        description: 'must be a date or null and is required'
                      },
                      updatedAt: {
                        bsonType: ['date', 'null'],
                        description: 'must be a date or null and is required'
                      }
                    }
                  },
                  personal: {
                    bsonType: 'object',
                    required: ['email', 'id', 'name', 'password'],
                    properties: {
                      email: {
                        bsonType: 'string',
                        description: 'must be a string and is required'
                      },
                      id: {
                        bsonType: 'string',
                        description: 'must be a string and is required'
                      },
                      name: {
                        bsonType: 'string',
                        description: 'must be a string and is required'
                      },
                      password: {
                        bsonType: 'string',
                        description: 'must be a string and is required'
                      }
                    }
                  },
                  settings: {
                    bsonType: 'object',
                    required: ['accountActivated', 'currency', 'handicap'],
                    properties: {
                      accountActivated: {
                        bsonType: 'bool',
                        description: 'must be a boolean and is required'
                      },
                      currency: {
                        bsonType: 'string',
                        description: 'must be a string and is required'
                      },
                      handicap: {
                        bsonType: 'int',
                        description: 'must be a int32 and is required'
                      }
                    }
                  },
                  temporary: {
                    bsonType: 'object',
                    required: [
                      'activationCode',
                      'activationCodeExpiration',
                      'resetPasswordToken',
                      'tempEmail',
                      'tempEmailCode',
                      'tempEmailCodeExpiration'
                    ],
                    properties: {
                      activationCode: {
                        bsonType: ['string', 'null'],
                        description: 'must be a string or null and is required'
                      },
                      activationCodeExpiration: {
                        bsonType: ['date', 'null'],
                        description: 'must be a date or null and is required'
                      },
                      resetPasswordToken: {
                        bsonType: ['string', 'null'],
                        description: 'must be a string or null and is required'
                      },
                      tempEmail: {
                        bsonType: ['string', 'null'],
                        description: 'must be a string or null and is required'
                      },
                      tempEmailCode: {
                        bsonType: ['string', 'null'],
                        description: 'must be a string or null and is required'
                      },
                      tempEmailCodeExpiration: {
                        bsonType: ['date', 'null'],
                        description: 'must be a date or null and is required'
                      }
                    }
                  }
                }
              }
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    })
}