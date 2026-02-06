const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticket System API',
      version: '1.0.0',
      description: 'API documentation for the Ticket Management System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Files containing annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;
