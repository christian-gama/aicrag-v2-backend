/* eslint-disable sort-keys */
export const LogSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['date', 'message', 'name', 'stack'],
      properties: {
        date: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        message: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        stack: {
          bsonType: 'string',
          description: 'must be a string and is required'
        }
      }
    }
  }
}
