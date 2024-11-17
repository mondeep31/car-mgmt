import { Request, Response } from 'express';

interface ApiDoc {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    contact: {
      name: string;
      email: string;
    };
    license: {
      name: string;
      url: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  components: any;
  paths: any;
}

export const getApiDocs = (req: Request | null, res: Response | null): ApiDoc | void => {
  const apiDocs: ApiDoc = {
    openapi: '3.0.0',
    info: {
      title: 'Spyne Car Management API',
      version: '1.0.0',
      description: 'API documentation for the Spyne Car Management System',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://team-mgmt-backend.el.r.appspot.com',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Car: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            images: { 
              type: 'array',
              items: { type: 'string' }
            },
            tags: {
              type: 'array',
              items: { type: 'string' }
            },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' }
          }
        }
      }
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'name'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                    name: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/cars': {
        get: {
          tags: ['Cars'],
          summary: 'Get all cars',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'search',
              in: 'query',
              schema: { type: 'string' },
              description: 'Search term for filtering cars'
            },
            {
              name: 'tags',
              in: 'query',
              schema: { type: 'string' },
              description: 'Comma-separated list of tags to filter by'
            }
          ],
          responses: {
            '200': {
              description: 'List of cars',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Car' }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Cars'],
          summary: 'Create a new car',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } },
                    images: {
                      type: 'array',
                      items: {
                        type: 'string',
                        format: 'binary'
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Car created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Car' }
                }
              }
            }
          }
        }
      },
      '/cars/{id}': {
        get: {
          tags: ['Cars'],
          summary: 'Get car by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Car details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Car' }
                }
              }
            }
          }
        },
        put: {
          tags: ['Cars'],
          summary: 'Update car',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } },
                    images: {
                      type: 'array',
                      items: {
                        type: 'string',
                        format: 'binary'
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Car updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Car' }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Cars'],
          summary: 'Delete car',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Car deleted successfully'
            }
          }
        }
      }
    }
  };

  if (res) {
    res.json(apiDocs);
    return;
  }
  return apiDocs;
};
