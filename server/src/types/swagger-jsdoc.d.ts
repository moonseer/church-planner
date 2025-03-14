declare module 'swagger-jsdoc' {
  export interface Options {
    definition: {
      openapi: string;
      info: {
        title: string;
        version: string;
        description?: string;
        termsOfService?: string;
        contact?: {
          name?: string;
          url?: string;
          email?: string;
        };
        license?: {
          name: string;
          url?: string;
        };
      };
      servers?: Array<{
        url: string;
        description?: string;
        variables?: Record<string, any>;
      }>;
      components?: {
        schemas?: Record<string, any>;
        responses?: Record<string, any>;
        parameters?: Record<string, any>;
        examples?: Record<string, any>;
        requestBodies?: Record<string, any>;
        headers?: Record<string, any>;
        securitySchemes?: Record<string, any>;
        links?: Record<string, any>;
        callbacks?: Record<string, any>;
      };
      security?: Array<Record<string, any>>;
      tags?: Array<{
        name: string;
        description?: string;
        externalDocs?: {
          description?: string;
          url: string;
        };
      }>;
      externalDocs?: {
        description?: string;
        url: string;
      };
      [key: string]: any;
    };
    apis: string | string[];
    [key: string]: any;
  }

  export default function swaggerJsdoc(options: Options): any;
} 