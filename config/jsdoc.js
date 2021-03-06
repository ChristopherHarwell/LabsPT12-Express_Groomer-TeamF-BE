module.exports = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'express-groomer-be',
      version: '0.1.0',
      description: 'express-groomer-be',
      license: {
        name: 'MIT',
        url: 'https://en.wikipedia.org/wiki/MIT_License',
      },
    },
    tags: [
      {
        name: 'status',
        description: 'Everything about your status',
      },
      {
        name: 'profile',
        description: 'Operations for profile',
      },
      {
        name: 'pets',
        description: 'Data for pets',
      },
    ],
    components: {
      securitySchemes: {
        okta: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Okta idToken JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
        BadRequest: {
          description: 'Bad request. profile already exists',
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'A message about the result',
                    example: 'Not Found',
                  },
                },
              },
            },
          },
        },
        PetNotFound: {
          description: 'Pet Not Found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'A message about the pets not found',
                    example:
                      'Unable to find a pet with id ${petId} for owner ${oktaId}',
                  },
                  validation: {
                    type: 'array',
                    description: 'An array of validation errors',
                    example: [],
                  },
                  data: {
                    type: 'array',
                    description: 'An array of objects containing the data',
                    example: {},
                  },
                },
              },
            },
          },
        },
        ServerError: {
          description: 'There was a problem completing the required operation',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'A message about the server error',
                    example: 'Server Error',
                  },
                  validation: {
                    type: 'array',
                    description: 'An array of validation errors',
                    example: [],
                  },
                  data: {
                    type: 'array',
                    description: 'An array of objects containing the data',
                    example: {},
                  },
                },
              },
            },
          },
        },
        NoReqBodyError: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'A message about the server error',
                    example: 'Server Error',
                  },
                  validation: {
                    type: 'array',
                    description: 'An array of validation errors',
                    example: [
                      'You must submit a request body in order to add a pet',
                    ],
                  },
                  data: {
                    type: 'array',
                    description: 'An array of objects containing the data',
                    example: {},
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./api/**/*Router.js'],
};
