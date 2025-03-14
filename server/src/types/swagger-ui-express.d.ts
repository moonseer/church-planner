declare module 'swagger-ui-express' {
  import { RequestHandler, Request, Response, NextFunction } from 'express';

  export interface SwaggerUiOptions {
    explorer?: boolean;
    swaggerOptions?: any;
    customCss?: string;
    customCssUrl?: string;
    customJs?: string;
    customfavIcon?: string;
    swaggerUrl?: string;
    customSiteTitle?: string;
    isExplorer?: boolean;
    swaggerUrls?: { url: string; name: string }[];
    [key: string]: any;
  }

  export function serveFiles(options?: SwaggerUiOptions): RequestHandler;
  export function setup(spec: any, options?: SwaggerUiOptions, ...middleware: RequestHandler[]): RequestHandler[];
  export function setup(spec: any, options?: SwaggerUiOptions): RequestHandler;
  export const serve: RequestHandler[];
  export function generateHTML(spec: any, options?: SwaggerUiOptions): string;
  export function getAbsoluteFSPath(): string;
} 