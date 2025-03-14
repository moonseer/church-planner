import swaggerJSDoc from 'swagger-jsdoc';
import { join } from 'path';
import { readdirSync } from 'fs';

// Get the absolute path to the source directory
const srcDir = __dirname.includes('/dist/')
  ? join(__dirname, '..') // For production build
  : join(__dirname, '..'); // For development

// Log for debugging
console.log('Swagger config - source directory:', srcDir);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Church Planner API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Church Planner application',
      contact: {
        name: 'Church Planner Support',
        email: 'support@church-planner.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
      {
        url: 'https://api.church-planner.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        },
        csrfToken: {
          type: 'apiKey',
          in: 'header',
          name: 'X-CSRF-Token'
        }
      }
    },
    security: [
      {
        cookieAuth: [],
        csrfToken: []
      }
    ]
  },
  // Use absolute paths
  apis: [
    join(srcDir, 'routes', '*.ts'),
    join(srcDir, 'models', '*.ts'),
    join(srcDir, 'server.ts')
  ],
};

// Log available files for debugging
try {
  console.log('Routes directory files:', readdirSync(join(srcDir, 'routes')));
  console.log('Models directory files:', readdirSync(join(srcDir, 'models')));
} catch (error) {
  console.error('Error reading directories:', error);
}

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 